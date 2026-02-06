import { projectMeta } from "@/lib/mock-data/project"
import { PageHeader } from "@/components/layout/page-header"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Project Settings" />
      <div className="p-6 space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General</CardTitle>
            <CardDescription>
              Core project configuration. These values are read-only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input defaultValue={projectMeta.name} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account</label>
              <Input defaultValue={projectMeta.account} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Repository</label>
              <Input defaultValue={projectMeta.repository} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Branch</label>
              <Input defaultValue={projectMeta.defaultBranch} disabled />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete this project</p>
                <p className="text-sm text-muted-foreground">
                  Once deleted, all jobs, runs, and environment configurations will
                  be permanently removed. This action cannot be undone.
                </p>
              </div>
              <Button variant="destructive" disabled className="ml-4 shrink-0">
                Delete Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
