"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Shield } from "lucide-react";
import { mockShiftRules } from "@/lib/mock-data";
import { ShiftRule } from "@/lib/types";

export default function RulesPage() {
  const [rules, setRules] = useState<ShiftRule[]>(mockShiftRules);

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const activeRules = rules.filter((r) => r.isActive).length;

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        title="Shift Rules"
        subtitle="Configure roster validation rules and warnings"
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6 max-w-3xl">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">
                    {activeRules} of {rules.length} rules active
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Active rules are checked when assigning staff to shifts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roster Validation Rules</CardTitle>
              <CardDescription>
                These rules help prevent scheduling conflicts and ensure staff wellbeing.
                Toggle rules on or off based on your requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`flex items-start justify-between rounded-lg border p-4 transition-colors ${
                    rule.isActive ? "bg-card" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-1.5 mt-0.5 ${
                        rule.isActive ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <AlertCircle
                        className={`h-4 w-4 ${
                          rule.isActive ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{rule.name}</p>
                        <Badge
                          variant={rule.isActive ? "default" : "secondary"}
                          className={
                            rule.isActive
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                        >
                          {rule.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => handleToggleRule(rule.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Rule changes take effect immediately
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Disabling a rule will allow staff assignments that would
                    otherwise be blocked. Use caution when disabling safety rules
                    like the night-morning gap requirement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
