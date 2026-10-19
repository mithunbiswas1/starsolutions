// src/app/(pages)/messages/[id]/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useGetClientMessageByIdQuery,
  useDeleteClientMessageMutation,
  useMarkMessageAsReadMutation,
  useMarkMessageAsRepliedMutation,
} from "@/redux/features/clientMessageApi";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H5, P } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import {
  FaArrowLeft,
  FaEnvelope,
  FaReply,
  FaTrash,
  FaUser,
  FaPhone,
  FaEnvelopeOpen,
} from "react-icons/fa";

export default function MessageDetailsPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params) || params;

  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteClientMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();
  const [markAsReplied] = useMarkMessageAsRepliedMutation();
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [isMarkingReplied, setIsMarkingReplied] = useState(false);

  const { data, isLoading, refetch } = useGetClientMessageByIdQuery(id, {
    skip: !id,
  });

  // If no id, show error
  if (!id) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-red-600">
                Invalid message ID
              </p>
              <LinkButton
                href="/admin/messages"
                variant="outline_primary"
                className="mt-4"
              >
                ← Back to Messages
              </LinkButton>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading message...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const message = data?.data;

  if (!message) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-gray-600">
                Message not found
              </p>
              <LinkButton
                href="/admin/messages"
                variant="outline_primary"
                className="mt-4"
              >
                ← Back to Messages
              </LinkButton>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Handle mark as read
  const handleMarkAsRead = async () => {
    try {
      setIsMarkingRead(true);
      await markAsRead({ id }).unwrap();
      toast.success("Message marked as read");
      refetch();
    } catch (error) {
      toast.error("Failed to mark message as read");
    } finally {
      setIsMarkingRead(false);
    }
  };

  // Handle mark as replied
  const handleMarkAsReplied = async () => {
    try {
      setIsMarkingReplied(true);
      await markAsReplied({ id }).unwrap();
      toast.success("Message marked as replied");
      refetch();
    } catch (error) {
      toast.error("Failed to mark message as replied");
    } finally {
      setIsMarkingReplied(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(id).unwrap();
        toast.success("Message deleted successfully");
        router.push("/admin/messages");
      } catch (error) {
        toast.error("Failed to delete message");
      }
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <LinkButton
            href="/admin/messages"
            variant="outline_primary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <FaArrowLeft size={14} />
            Back to Messages
          </LinkButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-2xl font-bold flex items-center gap-3">
                  Message Details
                  <StatusBadge
                    isRead={message.is_read}
                    isReplied={message.is_replied}
                  />
                </H5>
                <P className="text-gray-600 mt-1">
                  Received on{" "}
                  {format(new Date(message.createdAt), "dd MMM yyyy, hh:mm a")}
                </P>
              </div>
              <div className="flex flex-wrap gap-2">
                {!message.is_read && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMarkAsRead}
                    disabled={isMarkingRead}
                    className="flex items-center gap-2"
                  >
                    <FaEnvelopeOpen size={14} />
                    {isMarkingRead ? "Marking..." : "Mark as Read"}
                  </Button>
                )}
                {!message.is_replied && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMarkAsReplied}
                    disabled={isMarkingReplied}
                    className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100"
                  >
                    <FaReply size={14} />
                    {isMarkingReplied ? "Marking..." : "Mark as Replied"}
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  <FaTrash size={14} />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Sender Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                    {message.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {message.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <FaEnvelope size={12} />
                      <a
                        href={`mailto:${message.email}`}
                        className="hover:text-primary"
                      >
                        {message.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-0.5">
                      <FaPhone size={12} />
                      <a
                        href={`tel:${message.phone}`}
                        className="hover:text-primary"
                      >
                        {message.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Subject
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {message.subject}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Received
                    </span>
                    <span className="text-sm text-gray-700">
                      {format(
                        new Date(message.createdAt),
                        "dd MMM yyyy, hh:mm a",
                      )}
                    </span>
                  </div>
                  {message.ip_address && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        IP Address
                      </span>
                      <span className="text-sm text-gray-700">
                        {message.ip_address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Message
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {message.message}
                </p>
              </div>
            </div>

            {/* Reply Information */}
            {message.is_replied && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <FaReply className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Message has been replied
                    </p>
                    {message.replied_at && (
                      <p className="text-xs text-green-600">
                        Replied on{" "}
                        {format(
                          new Date(message.replied_at),
                          "dd MMM yyyy, hh:mm a",
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Reply Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                size="default"
                onClick={() =>
                  (window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`)
                }
                className="flex items-center gap-2"
              >
                <FaReply size={14} />
                Reply via Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Status Badge Component
function StatusBadge({ isRead, isReplied }) {
  if (isReplied) {
    return (
      <Badge variant="success" className="bg-green-100 text-green-700">
        Replied
      </Badge>
    );
  }
  if (isRead) {
    return (
      <Badge variant="info" className="bg-green-100 text-green-700">
        Read
      </Badge>
    );
  }
  return (
    <Badge variant="warning" className="bg-yellow-100 text-yellow-700">
      Unread
    </Badge>
  );
}

