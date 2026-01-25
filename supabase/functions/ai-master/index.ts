import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, fileType, duration } = await req.json();
    
    console.log('AI Master request:', { fileName, fileType, duration });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert audio mastering engineer. Based on the audio file information provided, suggest optimal mastering settings. 

You must respond with ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "eqBands": [
    { "frequency": 60, "gain": <number -12 to 12>, "Q": 1, "label": "60 Hz" },
    { "frequency": 170, "gain": <number -12 to 12>, "Q": 1, "label": "170 Hz" },
    { "frequency": 350, "gain": <number -12 to 12>, "Q": 1, "label": "350 Hz" },
    { "frequency": 1000, "gain": <number -12 to 12>, "Q": 1, "label": "1 kHz" },
    { "frequency": 3500, "gain": <number -12 to 12>, "Q": 1, "label": "3.5 kHz" },
    { "frequency": 10000, "gain": <number -12 to 12>, "Q": 1, "label": "10 kHz" }
  ],
  "compression": {
    "threshold": <number -60 to 0>,
    "ratio": <number 1 to 20>,
    "attack": <number 0.001 to 0.1>,
    "release": <number 0.05 to 1>
  },
  "limiter": {
    "threshold": <number -6 to 0>,
    "ceiling": <number -1 to 0>
  },
  "stereoWidth": <number 80 to 120>,
  "outputGain": <number -6 to 6>
}

Consider these mastering principles:
- Balance frequencies for clarity and punch
- Use moderate compression for glue without squashing dynamics
- Limit to prevent clipping while maintaining headroom
- Boost highs slightly for presence, control lows for tightness
- Output gain should bring levels close to -1dB ceiling`;

    const userPrompt = `Analyze this audio file and provide optimal mastering settings:
- File name: ${fileName}
- File type: ${fileType}
- Duration: ${duration ? `${Math.round(duration)} seconds` : 'unknown'}

Based on the file name and type, infer the likely genre/style and provide appropriate mastering settings.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const errorText = await response.text();
      console.error('AI Gateway error:', status, errorText);
      
      if (status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    console.log('AI Response content:', content);

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON from the AI response
    let settings;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      settings = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return default optimized settings as fallback
      settings = {
        eqBands: [
          { frequency: 60, gain: 1.5, Q: 1, label: "60 Hz" },
          { frequency: 170, gain: -0.5, Q: 1, label: "170 Hz" },
          { frequency: 350, gain: 0, Q: 1, label: "350 Hz" },
          { frequency: 1000, gain: 0.5, Q: 1, label: "1 kHz" },
          { frequency: 3500, gain: 1, Q: 1, label: "3.5 kHz" },
          { frequency: 10000, gain: 2, Q: 1, label: "10 kHz" }
        ],
        compression: {
          threshold: -18,
          ratio: 3,
          attack: 0.01,
          release: 0.2
        },
        limiter: {
          threshold: -1,
          ceiling: -0.3
        },
        stereoWidth: 100,
        outputGain: 2
      };
    }

    console.log('Returning settings:', settings);

    return new Response(JSON.stringify({ settings }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Master error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
