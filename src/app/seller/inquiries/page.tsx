"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Prisma } from '@prisma/client';
import Image from 'next/image';

type InquiryStatus = 'UNREAD' | 'READ' | 'REPLIED';

type SellerInquiry = Prisma.inquiriesGetPayload<{
  include: {
    users_inquiries_sender_idTousers: true;
    animals: true;
  };
}>;

function getImageUrl(imagesRaw: unknown): string {
  if (!imagesRaw) return "/placeholder-animal.svg";

  let parsed: unknown = imagesRaw;

  while (typeof parsed === "string") {
    const trimmed = parsed.trim();

    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/")
    ) {
      return trimmed;
    }

    if (trimmed.startsWith("[") || trimmed.startsWith('"')) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        break;
      }
    } else {
      break;
    }
  }

  if (Array.isArray(parsed) && parsed.length > 0) {
    const firstItem = parsed[0];
    if (typeof firstItem === "string" && firstItem.trim().length > 0) {
      return firstItem.trim();
    }
  }

  return "/placeholder-animal.svg";
}

const StatusBadge = ({ status }: { status: InquiryStatus }) => {
  const styles: Record<InquiryStatus, string> = {
    UNREAD: 'bg-rose-900/50 text-rose-300 border-rose-800',
    READ: 'bg-amber-900/50 text-amber-300 border-amber-800',
    REPLIED: 'bg-emerald-900/50 text-emerald-300 border-emerald-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

export default function SellerInquiriesPage() {
  const [inquiries, setInquiries] = React.useState<SellerInquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedInquiry, setSelectedInquiry] = React.useState<SellerInquiry | null>(null);
  const [replyText, setReplyText] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    async function fetchInquiries() {
      try {
        const res = await fetch('/api/inquiries');
        const data = await res.json();
        if (data.success) {
          setInquiries(data.data as SellerInquiry[]);
          if (data.data.length > 0) {
            setSelectedInquiry(data.data[0] as SellerInquiry);
          }
        }
      } catch (err) {
        console.error("Failed to load inquiries:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, []);

  const markAsRead = async (inquiry: SellerInquiry) => {
    if (inquiry.status === 'UNREAD') {
      try {
        await fetch('/api/inquiries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: inquiry.id, status: 'READ' }),
        });
        setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, status: 'READ' as InquiryStatus } : i));
        if (selectedInquiry?.id === inquiry.id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: 'READ' as InquiryStatus } : null);
        }
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleSelectInquiry = (inquiry: SellerInquiry) => {
    setSelectedInquiry(inquiry);
    setReplyText('');
    markAsRead(inquiry);
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return;

    setIsUpdating(true);
    try {
      const inquiryRes = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedInquiry.id, status: 'REPLIED' }),
      });

      if (inquiryRes.ok) {
        await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverId: selectedInquiry.sender_id,
            animalId: selectedInquiry.animal_id,
            message: `RE: ${selectedInquiry.animals?.name || 'Your inquiry'}\n\n${replyText}`,
          }),
        });

        setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, status: 'REPLIED' as InquiryStatus } : i));
        setSelectedInquiry(prev => prev ? { ...prev, status: 'REPLIED' as InquiryStatus } : null);
        setReplyText('');
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const unreadCount = inquiries.filter(i => i.status === 'UNREAD').length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-400">
        Loading inquiries...
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-100 mb-2">
          Buyer Inquiries
        </h1>
        <p className="text-sm text-emerald-400">
          Manage messages from potential buyers interested in your livestock listings.
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
              {unreadCount} unread
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {inquiries.length === 0 ? (
            <Card className="p-8 text-center border border-emerald-800 bg-emerald-950">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-900/50 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-emerald-400 font-medium">No inquiries yet</p>
              <p className="text-sm text-emerald-500 mt-1">
                When buyers message you about your listings, they'll appear here.
              </p>
            </Card>
          ) : (
            inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => handleSelectInquiry(inquiry)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedInquiry?.id === inquiry.id
                    ? 'bg-emerald-900 border-emerald-700 shadow-lg'
                    : inquiry.status === 'UNREAD'
                      ? 'bg-emerald-950/80 border-emerald-800 hover:border-emerald-700'
                      : 'bg-emerald-950/40 border-emerald-900 hover:border-emerald-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-800/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {inquiry.users_inquiries_sender_idTousers?.avatar_url ? (
                      <Image
                        src={inquiry.users_inquiries_sender_idTousers.avatar_url}
                        alt="Buyer"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-emerald-300 font-bold text-sm">
                        {(inquiry.users_inquiries_sender_idTousers?.name || 'B').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`font-bold text-sm truncate ${inquiry.status === 'UNREAD' ? 'text-emerald-100' : 'text-emerald-300'}`}>
                        {inquiry.users_inquiries_sender_idTousers?.name || 'Unknown Buyer'}
                      </span>
                      <StatusBadge status={inquiry.status as InquiryStatus} />
                    </div>
                    <p className="text-xs text-emerald-400 font-medium mb-1">
                      Re: {inquiry.animals?.name || 'Listing'}
                    </p>
                    <p className={`text-xs truncate ${inquiry.status === 'UNREAD' ? 'text-emerald-200' : 'text-emerald-500'}`}>
                      {inquiry.message}
                    </p>
                    <p className="text-[10px] text-emerald-600 mt-2">
                      {new Date(inquiry.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <Card className="border border-emerald-800 bg-emerald-950 h-full flex flex-col">
              <div className="p-6 border-b border-emerald-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-900 flex-shrink-0 relative overflow-hidden border border-emerald-800">
                      <Image
                        src={getImageUrl(selectedInquiry.animals?.images)}
                        alt={selectedInquiry.animals?.name || 'Animal'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-100">
                        {selectedInquiry.animals?.name || 'Listing Inquiry'}
                      </h3>
                      <p className="text-sm text-emerald-400">
                        {selectedInquiry.animals?.breed || ''} • {selectedInquiry.animals?.category || ''}
                      </p>
                      <p className="text-emerald-300 font-bold mt-1">
                        ₦{Number(selectedInquiry.animals?.price ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={selectedInquiry.status as InquiryStatus} />
                    <p className="text-[10px] text-emerald-500 mt-2">
                      Received: {new Date(selectedInquiry.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-emerald-800">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-800/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {selectedInquiry.users_inquiries_sender_idTousers?.avatar_url ? (
                      <Image
                        src={selectedInquiry.users_inquiries_sender_idTousers.avatar_url}
                        alt="Buyer"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-emerald-300 font-bold text-sm">
                        {(selectedInquiry.users_inquiries_sender_idTousers?.name || 'B').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-emerald-100">
                        {selectedInquiry.users_inquiries_sender_idTousers?.name || 'Unknown Buyer'}
                      </span>
                      <span className="text-[10px] text-emerald-500">
                        {selectedInquiry.users_inquiries_sender_idTousers?.email || ''}
                      </span>
                    </div>
                    <div className="bg-emerald-900/50 rounded-xl rounded-tl-none p-4 border border-emerald-800/50">
                      <p className="text-emerald-200 text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedInquiry.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 mt-auto">
                <label className="block text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                  Reply to Buyer
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here... Include pricing, availability, delivery options, or contact details."
                  className="w-full h-32 bg-emerald-900/30 border border-emerald-800 rounded-xl p-4 text-emerald-100 placeholder-emerald-600 text-sm focus:outline-none focus:border-emerald-600 resize-none"
                />
                <div className="flex justify-end mt-4 gap-3">
                  <button
                    onClick={() => setReplyText('')}
                    className="px-5 py-2.5 rounded-lg font-bold text-sm text-emerald-400 border border-emerald-800 hover:bg-emerald-900/50 transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || isUpdating}
                    className="px-6 py-2.5 rounded-lg font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center border border-emerald-800 bg-emerald-950 h-full flex items-center justify-center">
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-900/50 flex items-center justify-center">
                  <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-200 mb-2">Select an Inquiry</h3>
                <p className="text-sm text-emerald-500 max-w-xs mx-auto">
                  Choose a message from the list to view details and respond to potential buyers.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
