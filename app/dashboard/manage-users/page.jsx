"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    Search,
    Shield,
    Ban,
    CheckCircle2,
    Loader2,
    Sparkles,
} from "lucide-react";

export default function ManageUsersPage() {
    const { data: session } = useSession();
    const currentUserEmail = session?.user?.email;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchUsers() {
            try {
                const data = await apiRequest("/api/users/admin/all");
                if (isMounted && Array.isArray(data)) {
                    setUsers(data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load users list");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchUsers();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleRoleToggle = async (targetUser) => {
        const nextRole = targetUser.role === "admin" ? "customer" : "admin";
        setUpdatingId(targetUser._id);
        try {
            const res = await apiRequest(
                `/api/users/admin/${targetUser._id}/role`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ role: nextRole }),
                }
            );

            setUsers((prev) =>
                prev.map((u) =>
                    u._id === targetUser._id ? { ...u, role: nextRole } : u
                )
            );

            toast.success(
                res.message || `${targetUser.name}'s role updated to ${nextRole}`
            );
        } catch (error) {
            toast.error(error.message || "Failed to update user role");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleBlockToggle = async (targetUser) => {
        const nextBlocked = !targetUser.isBlocked;
        setUpdatingId(targetUser._id);
        try {
            const res = await apiRequest(
                `/api/users/admin/${targetUser._id}/block`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ isBlocked: nextBlocked }),
                }
            );

            setUsers((prev) =>
                prev.map((u) =>
                    u._id === targetUser._id ? { ...u, isBlocked: nextBlocked } : u
                )
            );

            toast.success(
                res.message ||
                `${targetUser.name} has been ${nextBlocked ? "blocked" : "unblocked"}`
            );
        } catch (error) {
            toast.error(error.message || "Failed to update user status");
        } finally {
            setUpdatingId(null);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const filteredUsers = users.filter((u) => {
        const q = searchTerm.toLowerCase();
        return (
            u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
        );
    });

    if (loading) {
        return <Loader text="Loading registered members..." />;
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#271710] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-lg">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

                <div className="relative space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Access Control
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
                        Manage <span className="text-gold-gradient">Users</span>
                    </h1>
                    <p className="text-sm text-zinc-300">
                        Assign admin privileges or restrict account access for platform members.
                    </p>
                </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-amber-200/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-amber-200/80 focus-visible:ring-amber-500/40"
                    />
                </div>

                <p className="text-xs font-semibold text-zinc-500">
                    Total Members:{" "}
                    <span className="font-extrabold text-zinc-950">
                        {filteredUsers.length}
                    </span>
                </p>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl border border-amber-200/70 text-center space-y-3 shadow-xs">
                    <Users className="w-8 h-8 text-amber-600 mx-auto" />
                    <h2 className="text-lg font-bold text-zinc-900">No Users Found</h2>
                </div>
            ) : (
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-amber-200/70 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-rose-50/70 border-b border-amber-200/70 text-[11px] font-bold uppercase tracking-wider text-amber-950">
                                    <th className="py-4 px-5">Member</th>
                                    <th className="py-4 px-4">Role</th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-sm">
                                {filteredUsers.map((member) => {
                                    const isSelf = member.email === currentUserEmail;

                                    return (
                                        <tr
                                            key={member._id}
                                            className="hover:bg-amber-50/30 transition-colors"
                                        >
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 ring-1 ring-amber-300/60">
                                                        <AvatarImage
                                                            src={member.image || ""}
                                                            alt={member.name}
                                                        />
                                                        <AvatarFallback className="bg-gradient-to-br from-zinc-900 to-amber-950 text-amber-300 text-xs font-bold">
                                                            {getInitials(member.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-zinc-900">
                                                            {member.name}{" "}
                                                            {isSelf && (
                                                                <span className="text-[11px] font-semibold text-amber-700">
                                                                    (You)
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-zinc-500">
                                                            {member.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                {member.role === "admin" ? (
                                                    <Badge className="bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 uppercase text-[10px]">
                                                        Admin
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-100 uppercase text-[10px]">
                                                        Customer
                                                    </Badge>
                                                )}
                                            </td>

                                            <td className="py-4 px-4">
                                                {member.isBlocked ? (
                                                    <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100">
                                                        Blocked
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
                                                        Active
                                                    </Badge>
                                                )}
                                            </td>

                                            <td className="py-4 px-5">
                                                {isSelf ? (
                                                    <span className="text-xs text-zinc-400 italic">
                                                        Current Session
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={updatingId === member._id}
                                                            onClick={() => handleRoleToggle(member)}
                                                            className="rounded-xl h-8 px-3 border-amber-200 text-amber-900 hover:bg-amber-50 cursor-pointer"
                                                        >
                                                            {updatingId === member._id ? (
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Shield className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                                                                    {member.role === "admin"
                                                                        ? "Make Customer"
                                                                        : "Make Admin"}
                                                                </>
                                                            )}
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={updatingId === member._id}
                                                            onClick={() => handleBlockToggle(member)}
                                                            className={`rounded-xl h-8 px-3 cursor-pointer ${member.isBlocked
                                                                    ? "border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100"
                                                                    : "border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100"
                                                                }`}
                                                        >
                                                            {member.isBlocked ? (
                                                                <>
                                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                                    Unblock
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Ban className="w-3.5 h-3.5 mr-1.5" />
                                                                    Block
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}