import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Users,
    Plus,
    Mail,
    Shield,
    Crown,
    MoreVertical,
    Search,
    UserPlus,
    Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'editor' | 'viewer';
    avatar?: string;
    joinedDate: string;
    lastActive: string;
}

const TeamManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    // Mock team members
    const teamMembers: TeamMember[] = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'owner',
            joinedDate: '2024-01-15',
            lastActive: '2 hours ago',
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'admin',
            joinedDate: '2024-02-20',
            lastActive: '1 day ago',
        },
        {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            role: 'editor',
            joinedDate: '2024-03-10',
            lastActive: '3 hours ago',
        },
        {
            id: '4',
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            role: 'editor',
            joinedDate: '2024-03-15',
            lastActive: '5 hours ago',
        },
        {
            id: '5',
            name: 'Tom Brown',
            email: 'tom@example.com',
            role: 'viewer',
            joinedDate: '2024-04-01',
            lastActive: '2 days ago',
        },
    ];

    const roles = [
        {
            id: 'owner',
            name: 'Owner',
            description: 'Full access to all features and settings',
            icon: Crown,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/10',
        },
        {
            id: 'admin',
            name: 'Admin',
            description: 'Can manage team members and settings',
            icon: Shield,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            id: 'editor',
            name: 'Editor',
            description: 'Can create and edit design system components',
            icon: Settings,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            id: 'viewer',
            name: 'Viewer',
            description: 'Read-only access to the design system',
            icon: Users,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/10',
        },
    ];

    const filteredMembers = teamMembers.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !selectedRole || member.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'owner':
                return 'default';
            case 'admin':
                return 'secondary';
            case 'editor':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="max-w-7xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">Team Management</h1>
                                <p className="text-xs text-muted-foreground">
                                    {teamMembers.length} team members
                                </p>
                            </div>
                        </div>

                        <Button className="gap-2">
                            <UserPlus className="w-4 h-4" />
                            Invite Member
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search team members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Roles */}
                <div className="w-64 border-r bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Filter by Role
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${!selectedRole ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                                    }`}
                            >
                                All Members ({teamMembers.length})
                            </button>

                            <Separator className="my-2" />

                            {roles.map((role) => {
                                const Icon = role.icon;
                                const count = teamMembers.filter((m) => m.role === role.id).length;
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedRole === role.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-muted'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className={`w-4 h-4 ${role.color}`} />
                                            <span className="text-sm font-bold">{role.name}</span>
                                        </div>
                                        <Badge variant="secondary">{count}</Badge>
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <div className="border-b px-6 py-3 bg-card/30">
                        <h3 className="text-sm font-bold">
                            {selectedRole
                                ? `${roles.find((r) => r.id === selectedRole)?.name}s`
                                : 'All Members'}{' '}
                            ({filteredMembers.length})
                        </h3>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            {filteredMembers.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                                    <p className="text-muted-foreground">No team members found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredMembers.map((member) => {
                                        const roleInfo = roles.find((r) => r.id === member.role);
                                        const RoleIcon = roleInfo?.icon || Users;
                                        return (
                                            <div
                                                key={member.id}
                                                className="group p-4 border rounded-xl hover:border-primary/50 transition-all hover:shadow-sm"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarFallback className="font-bold">
                                                            {getInitials(member.name)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold">{member.name}</h4>
                                                            <Badge variant={getRoleBadgeVariant(member.role)}>
                                                                {roleInfo?.name}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="w-3 h-3" />
                                                                <span>{member.email}</span>
                                                            </div>
                                                            <span>•</span>
                                                            <span>Joined {new Date(member.joinedDate).toLocaleDateString()}</span>
                                                            <span>•</span>
                                                            <span>Active {member.lastActive}</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Panel - Role Info */}
                <div className="w-80 border-l bg-card/30 flex flex-col">
                    <div className="p-4 border-b">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Roles & Permissions
                        </h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-4">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                const count = teamMembers.filter((m) => m.role === role.id).length;
                                return (
                                    <div key={role.id} className="p-4 border rounded-xl">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-lg ${role.bgColor} flex items-center justify-center`}>
                                                <Icon className={`w-5 h-5 ${role.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold">{role.name}</h4>
                                                    <Badge variant="secondary">{count}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {role.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-xs">
                                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                                Permissions
                                            </Label>
                                            <div className="space-y-1">
                                                {role.id === 'owner' && (
                                                    <>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-green-500" />
                                                            <span>Full system access</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-green-500" />
                                                            <span>Manage billing</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-green-500" />
                                                            <span>Delete workspace</span>
                                                        </div>
                                                    </>
                                                )}
                                                {role.id === 'admin' && (
                                                    <>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                            <span>Manage team</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                            <span>Edit all content</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                            <span>Configure settings</span>
                                                        </div>
                                                    </>
                                                )}
                                                {role.id === 'editor' && (
                                                    <>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-purple-500" />
                                                            <span>Create components</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-purple-500" />
                                                            <span>Edit tokens</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-purple-500" />
                                                            <span>Export system</span>
                                                        </div>
                                                    </>
                                                )}
                                                {role.id === 'viewer' && (
                                                    <>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-gray-500" />
                                                            <span>View components</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-gray-500" />
                                                            <span>View documentation</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <div className="w-1 h-1 rounded-full bg-gray-500" />
                                                            <span>Export tokens</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t">
                        <Button variant="outline" className="w-full gap-2" size="sm">
                            <Settings className="w-4 h-4" />
                            Configure Roles
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;
