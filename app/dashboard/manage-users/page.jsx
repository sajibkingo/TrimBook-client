"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Search,
    Eye,
    Ban,
    ShieldCheck,
    Loader2,
    Users,
} from "lucide-react";

export default function ManageUsersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [togglingId, setTogglingId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadUsers() {
            try {
                const data = await apiRequest("/api/users");
                if (isMounted) setCustomers(data);
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Failed to load registered customers");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadUsers();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleToggleBlock = async (customer) => {
        const nextBlocked = !customer.isBlocked;
        setTogglingId(customer._id);

        try {
            await apiRequest(`/api/users/${customer._id}/block`, {
                method: "PATCH",
                body: JSON.stringify({ isBlocked: nextBlocked }),
            });

            toast.success(
                nextBlocked
                    ? `${customer.name} has been blocked.`
                    : `${customer.name} has been unblocked.`
            );

            setCustomers((prev) =>
                prev.map((item) =>
                    item._id === customer._id ? { ...item, isBlocked: nextBlocked } : item
                )
            );

            if (selectedUser?._id === customer._id) {
                setSelectedUser((prev) => ({ ...prev, isBlocked: nextBlocked }));
            }
        } catch (error) {
            toast.error(error.message || "Failed to update user status");
        } finally {
            setTogglingId(null);
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "N/A";
        return new Date(dateValue).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const filteredCustomers = customers.filter((c) => {
        const query = searchTerm.trim().toLowerCase();
        return (
            !query ||
            c.name?.toLowerCase().includes(query) ||
            c.email?.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return <Loader text="Loading registered customers..." />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Customer Directory
                </span>
                <h1 className="text-2xl font-bold text-zinc-900 mt-1">Manage Users</h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                    View registered customers, inspect account details, and block or unblock platform access.
                </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs">
                <div className="relative max-w-md">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-zinc-200"
                    />
                </div>
            </div>

            {filteredCustomers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-14 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900">No Customers Found</h2>
                    <p className="text-sm text-zinc-500">
                        No registered customer accounts match your search.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200/80 bg-[#FAF9F6] text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                    <th className="py-3.5 px-5">Customer</th>
                                    <th className="py-3.5 px-5">Joined</th>
                                    <th className="py-3.5 px-5">Bookings</th>
                                    <th className="py-3.5 px-5">Status</th>
                                    <th className="py-3.5 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-sm">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-zinc-50/70">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-zinc-200">
                                                    <AvatarImage src={customer.image || ""} alt={customer.name} />
                                                    <AvatarFallback className="bg-zinc-900 text-amber-400 text-xs font-semibold">
                                                        {(customer.name || "U").slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-zinc-900">{customer.name}</p>
                                                    <p className="text-xs text-zinc-500">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 text-zinc-600">
                                            {formatDate(customer.createdAt)}
                                        </td>
                                        <td className="py-4 px-5 font-medium text-zinc-800">
                                            {customer.appointmentCount ?? 0}
                                        </td>
                                        <td className="py-4 px-5">
                                            {customer.isBlocked ? (
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
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedUser(customer)}
                                                    className="rounded-xl h-8 px-3 border-zinc-300 cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                    Details
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant={customer.isBlocked ? "outline" : "destructive"}
                                                    size="sm"
                                                    disabled={togglingId === customer._id}
                                                    onClick={() => handleToggleBlock(customer)}
                                                    className="rounded-xl h-8 px-3 cursor-pointer"
                                                >
                                                    {togglingId === customer._id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : customer.isBlocked ? (
                                                        <>
                                                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            <Dialog
                open={!!selectedUser}
                onOpenChange={(open) => !open && setSelectedUser(null)}
            >
                <DialogContent className="sm:max-w-md rounded-2xl">
                    {selectedUser && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Customer Profile Details</DialogTitle>
                                <DialogDescription>User ID: #{selectedUser._id}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 pt-2 text-sm">
                                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF9F6] border border-zinc-200/80">
                                    <Avatar className="h-14 w-14 border border-zinc-200">
                                        <AvatarImage src={selectedUser.image || ""} alt={selectedUser.name} />
                                        <AvatarFallback className="bg-zinc-900 text-amber-400 font-bold">
                                            {(selectedUser.name || "U").slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 text-base">
                                            {selectedUser.name}
                                        </h4>
                                        <p className="text-zinc-500">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Phone Number</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">
                                            {selectedUser.phone || "Not provided"}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Total Appointments</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">
                                            {selectedUser.appointmentCount ?? 0}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Joined Date</p>
                                        <p className="font-semibold text-zinc-900 mt-0.5">
                                            {formatDate(selectedUser.createdAt)}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl border border-zinc-200/80">
                                        <p className="text-xs text-zinc-400">Access Status</p>
                                        <div className="mt-1">
                                            {selectedUser.isBlocked ? (
                                                <Badge className="bg-rose-100 text-rose-800">Blocked</Badge>
                                            ) : (
                                                <Badge className="bg-emerald-100 text-emerald-800">Active</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}