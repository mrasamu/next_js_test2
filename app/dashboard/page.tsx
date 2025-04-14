"use client";

import { createContext, useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

// Context for managing button states
const DashboardContext = createContext<{
  buttonStates: { [key: string]: string };
  setButtonState: (id: string, state: string) => void;
}>({
  buttonStates: {},
  setButtonState: () => {},
});

const mockData = [
  {
    id: 1,
    accountName: "小象妈妈",
    profile: "美妆类带货博主，经常带货高端护肤品，对韩国和日本品牌有特别偏好。",
  },
  {
    id: 2,
    accountName: "零食小当家",
    profile: "零食类带货博主，专注进口零食推广，对日韩零食品牌有深入研究，经常测评新品。",
  },
  {
    id: 3,
    accountName: "健康食光",
    profile: "食品类带货博主，主打有机健康食品，对全谷物和低糖食品有专业见解，经常直播烹饪教程。",
  },
  {
    id: 4,
    accountName: "药妆研究所",
    profile: "美妆类带货博主，专注药妆产品测评，对敏感肌护理和修复产品有独到见解，经常分享使用心得。",
  },
  {
    id: 5,
    accountName: "糕点达人",
    profile: "零食类带货博主，专注传统糕点和特色小吃推广，擅长发掘地方特色美食，节日产品推荐深受欢迎。",
  },
  {
    id: 6,
    accountName: "环球美食家",
    profile: "食品类带货博主，专注进口食材和调味品推广，经常直播美食制作，对各国特色食材有专业解读。",
  },
  {
    id: 7,
    accountName: "彩妆教主",
    profile: "美妆类带货博主，专注彩妆产品测评，对限量版和联名产品有独特见解，美妆教程备受追捧。",
  },
  {
    id: 8,
    accountName: "轻食先锋",
    profile: "零食类带货博主，主打健康零食，专注低卡路里和高蛋白零食推广，经常分享健康饮食知识。",
  },
  {
    id: 9,
    accountName: "速食女王",
    profile: "食品类带货博主，专注即食美味推荐，对方便速食产品有独到见解，擅长发掘性价比产品。",
  },
  {
    id: 10,
    accountName: "有机美妆",
    profile: "美妆类带货博主，主打天然有机护肤品，对小众护肤品牌有深入研究，经常分享成分党知识。",
  },
];

function ActionButton({ id }: { id: string }) {
  const { buttonStates, setButtonState } = useContext(DashboardContext);
  const [progress, setProgress] = useState(0);

  const handleClick = async () => {
    const state = buttonStates[id] || "initial";

    if (state === "initial") {
      setButtonState(id, "generating");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setButtonState(id, "complete");
    } else if (state === "complete") {
      // Get the user data for this row
      const userData = mockData.find((user) => user.id.toString() === id);
      if (!userData) return;

      // Create a text file with user profile data
      const content = `用户画像报告\n\n账户名：${userData.accountName}\n\n详细画像：${userData.profile}\n\n生成时间：${new Date().toLocaleString()}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);

      // Simulate progress
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Start download when progress reaches 100%
            const a = document.createElement('a');
            a.href = url;
            a.download = `用户画像_${userData.accountName}_${new Date().getTime()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const getButtonProps = () => {
    const state = buttonStates[id] || "initial";
    switch (state) {
      case "generating":
        return {
          variant: "secondary" as const,
          children: (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              正在生成中
            </>
          ),
          disabled: true,
        };
      case "complete":
        return {
          variant: "default" as const,
          children: (
            <>
              <Download className="mr-2 h-4 w-4" />
              生成完毕，点击下载
              {progress > 0 && progress < 100 && ` (${progress}%)`}
            </>
          ),
        };
      default:
        return {
          variant: "default" as const,
          children: "点击生成",
        };
    }
  };

  return (
    <Button
      className="w-full transition-all duration-200"
      onClick={handleClick}
      {...getButtonProps()}
    />
  );
}

export default function DashboardPage() {
  const [buttonStates, setButtonStates] = useState<{ [key: string]: string }>({});

  const setButtonState = (id: string, state: string) => {
    setButtonStates((prev) => ({ ...prev, [id]: state }));
  };

  return (
    <DashboardContext.Provider value={{ buttonStates, setButtonState }}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold">账号管理</h1>
          <div className="rounded-lg border bg-white shadow">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[25%]">账户名</TableHead>
                  <TableHead className="w-[50%]">用户画像</TableHead>
                  <TableHead className="w-[25%]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.accountName}
                    </TableCell>
                    <TableCell>{row.profile}</TableCell>
                    <TableCell>
                      <ActionButton id={row.id.toString()} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}