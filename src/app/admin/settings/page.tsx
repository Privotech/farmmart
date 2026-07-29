
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default async function AdminSettings() {
  const session = await getSession();

  if (!session?.userId || session.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Site Settings</h1>
      <Card>
        <form>
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <Input
                type="text"
                id="siteName"
                name="siteName"
                className="mt-1 block w-full"
                placeholder="FarmMart"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <Input
                type="email"
                id="contactEmail"
                name="contactEmail"
                className="mt-1 block w-full"
                placeholder="support@farmmart.com"
              />
            </div>
            <Button type="submit" variant="primary">
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
    