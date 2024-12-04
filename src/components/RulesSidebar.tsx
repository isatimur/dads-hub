import { AlertCircle, BookOpen, Shield } from "lucide-react";
import { Card } from "./ui/card";

export const RulesSidebar = () => {
  const rules = [
    {
      title: "Be Respectful",
      description: "Treat others with kindness and respect. No harassment or hate speech.",
      icon: <Shield className="w-5 h-5 text-primary" />,
    },
    {
      title: "Stay On Topic",
      description: "Posts should be relevant to conscious parenting and fatherhood.",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
    },
    {
      title: "No Self-Promotion",
      description: "Avoid promotional content or spam. Focus on meaningful discussions.",
      icon: <AlertCircle className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <Card className="p-4 sticky top-24 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 group">
        <Shield className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
        Community Rules
      </h2>
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="flex gap-3 group hover:bg-primary/5 p-2 rounded-lg transition-all duration-300"
          >
            <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              {rule.icon}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                {rule.title}
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {rule.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};