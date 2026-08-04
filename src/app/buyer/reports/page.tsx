"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

// Mock reports data
const mockReports = [
  {
    id: "rep-001",
    title: "Q3 Procurement Report",
    type: "financial",
    date: "Aug 10, 2025",
    status: "generated",
    format: "PDF"
  },
  {
    id: "rep-002",
    title: "Supplier Performance Scorecard",
    type: "supplier",
    date: "Aug 5, 2025",
    status: "generated",
    format: "Excel"
  },
  {
    id: "rep-003",
    title: "Price Trend Analysis",
    type: "market",
    date: "Jul 30, 2025",
    status: "generated",
    format: "PDF"
  },
  {
    id: "rep-004",
    title: "Inventory Turnover Report",
    type: "inventory",
    date: "Jul 25, 2025",
    status: "generated",
    format: "Excel"
  }
];

// Mock report templates
const reportTemplates = [
  {
    id: "tpl-financial",
    title: "Financial Report",
    description: "Summary of all procurement spend and payment history"
  },
  {
    id: "tpl-supplier",
    title: "Supplier Performance",
    description: "Scorecard and performance metrics for all suppliers"
  },
  {
    id: "tpl-market",
    title: "Market Analysis",
    description: "Price trends and market insights analysis"
  },
  {
    id: "tpl-inventory",
    title: "Inventory Report",
    description: "Inventory turnover and stock levels summary"
  }
];

export default function BuyerReportsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reports, setReports] = useState(mockReports);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
    if (status !== "loading" && session?.user?.role !== "BUYER") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const handleGenerateReport = (templateId: string) => {
    setIsGenerating(templateId);
    setTimeout(() => {
      const newReport = {
        id: `rep-${Date.now()}`,
        title: `${reportTemplates.find(t => t.id === templateId)?.title} (${new Date().toLocaleDateString()})`,
        type: templateId.split("-")[1],
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "generated",
        format: "PDF"
      };
      setReports([newReport, ...reports]);
      setIsGenerating(null);
      alert("Report generated successfully!");
    }, 2000);
  };

  const handleDownloadReport = (reportId: string) => {
    alert(`Downloading report ${reportId}...`);
  };

  if (status === "loading" || !session) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-1">Reports</h1>
              <p className="text-sm text-gray-400 font-medium">Generate and download procurement reports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generate Reports Section */}
            <div className="bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-800">
              <h2 className="text-xl font-bold text-gray-100 mb-6">Generate New Report</h2>
              <div className="space-y-4">
                {reportTemplates.map(template => (
                  <div key={template.id} className="border border-gray-800 p-4 rounded-xl hover:border-emerald-500/50 transition bg-gray-800/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-100 mb-1">{template.title}</h3>
                        <p className="text-sm text-gray-400">{template.description}</p>
                      </div>
                      <Button
                        variant="primary"
                        onClick={() => handleGenerateReport(template.id)}
                        disabled={isGenerating === template.id}
                        className="text-sm"
                      >
                        {isGenerating === template.id ? "Generating..." : "Generate"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Reports Section */}
            <div className="bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-800">
              <h2 className="text-xl font-bold text-gray-100 mb-6">Recent Reports</h2>
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="border border-gray-800 p-4 rounded-xl hover:border-emerald-500/50 transition bg-gray-800/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-100 mb-1">{report.title}</h3>
                        <p className="text-sm text-gray-400">Generated on {report.date} • {report.format}</p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => handleDownloadReport(report.id)}
                        className="text-sm bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  );
}
