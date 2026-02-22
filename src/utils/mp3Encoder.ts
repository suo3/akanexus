import { Mp3Encoder } from 'lamejs';

export type ExportFormat = 'wav' | 'mp3';

/**
 * Encode a rendered AudioBuffer to MP3 using lamejs.
 * Returns a Blob of type audio/mpeg.
 *
 * @param buffer  The AudioBuffer to encode (from OfflineAudioContext.startRendering)
 * @param kbps    Bitrate in kbps (default 320)
 */
export function encodeToMp3(buffer: AudioBuffer, kbps: number = 320): Blob {
    const channels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const encoder = new Mp3Encoder(channels === 1 ? 1 : 2, sampleRate, kbps);

    // Convert Float32 [-1, 1] to Int16 [-32768, 32767]
    const toInt16 = (float32: Float32Array): Int16Array => {
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
            const s = Math.max(-1, Math.min(1, float32[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        return int16;
    };

    const leftData = toInt16(buffer.getChannelData(0));
    const rightData = channels > 1 ? toInt16(buffer.getChannelData(1)) : undefined;

    const mp3Data: Int8Array[] = [];

    // lamejs processes in chunks of 1152 samples per channel (MPEG frame size)
    const CHUNK = 1152;
    for (let i = 0; i < leftData.length; i += CHUNK) {
        const leftChunk = leftData.subarray(i, i + CHUNK);
        const rightChunk = rightData ? rightData.subarray(i, i + CHUNK) : undefined;
        const encoded = encoder.encodeBuffer(leftChunk, rightChunk);
        if (encoded.length > 0) mp3Data.push(encoded);
    }

    const flushed = encoder.flush();
    if (flushed.length > 0) mp3Data.push(flushed);

    return new Blob(mp3Data.map(chunk => new Int8Array(chunk) as unknown as BlobPart), { type: 'audio/mpeg' });
}
