import { useState, useEffect } from "react";
import { format } from "date-fns";
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { formatDistanceToNow } from "date-fns";

// 常用时区列表
const TIMEZONES = [
  "Asia/Shanghai",        // 中国上海
  "Asia/Tokyo",           // 日本东京
  "Europe/London",        // 英国伦敦
  "Europe/Paris",         // 法国巴黎
  "America/New_York",     // 美国纽约
  "America/Los_Angeles",  // 美国洛杉矶
  "Australia/Sydney",     // 澳大利亚悉尼
  "Pacific/Auckland"      // 新西兰奥克兰
];

// 格式化选项
const FORMAT_OPTIONS = [
  { id: "default", label: "默认格式", format: "yyyy-MM-dd HH:mm:ss" },
  { id: "full", label: "完整日期时间", format: "yyyy年MM月dd日 HH时mm分ss秒" },
  { id: "date", label: "仅日期", format: "yyyy-MM-dd" },
  { id: "time", label: "仅时间", format: "HH:mm:ss" },
  { id: "relative", label: "相对时间", format: "relative" },
  { id: "iso", label: "ISO 格式", format: "ISO" },
  { id: "custom", label: "自定义格式", format: "EEE, MMM d, yyyy h:mm a XXX" }
];

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Shanghai");
  const [selectedFormat, setSelectedFormat] = useState(FORMAT_OPTIONS[0]);
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 格式化时间
  const formatTime = (time: Date, formatStr: string, tz: string) => {
    if (formatStr === "relative") {
      return formatDistanceToNow(time, { addSuffix: true });
    } else if (formatStr === "ISO") {
      return time.toISOString();
    } else {
      return formatInTimeZone(time, tz, formatStr);
    }
  };

  // 处理自定义日期时间
  const handleCustomDateTime = () => {
    if (customDate && customTime) {
      const customDateTime = `${customDate}T${customTime}`;
      setCurrentTime(new Date(customDateTime));
    }
  };

  // 获取时区偏移量
  const getTimezoneOffsetString = (tz: string) => {
    const offsetMinutes = getTimezoneOffset(tz, new Date()) / 60000;
    const hours = Math.abs(Math.floor(offsetMinutes / 60));
    const minutes = Math.abs(Math.floor(offsetMinutes % 60));
    const sign = offsetMinutes >= 0 ? '+' : '-';
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Date-fns 时区格式化示例</h1>
      
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">当前设置</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择时区
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择格式
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedFormat.id}
              onChange={(e) => {
                const format = FORMAT_OPTIONS.find(f => f.id === e.target.value);
                if (format) setSelectedFormat(format);
              }}
            >
              {FORMAT_OPTIONS.map((format) => (
                <option key={format.id} value={format.id}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">自定义日期时间</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日期
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              时间
            </label>
            <input
              type="time"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
            />
          </div>
        </div>
        
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleCustomDateTime}
          disabled={!customDate || !customTime}
        >
          应用自定义日期时间
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold mb-2">
            {formatTime(currentTime, "yyyy-MM-dd HH:mm:ss", selectedTimezone)}
          </h2>
        </div>
        
        <div className="p-6">
          <h3 className="font-semibold mb-4">所选格式: {selectedFormat.label}</h3>
          <div className="bg-gray-100 p-4 rounded-md font-mono break-all">
            {formatTime(currentTime, selectedFormat.format, selectedTimezone)}
          </div>
          
          {selectedFormat.id !== "relative" && selectedFormat.id !== "ISO" && (
            <div className="mt-2 text-sm text-gray-500">
              格式字符串: <code>{selectedFormat.format}</code>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-gray-50">
          <h3 className="font-semibold mb-4">所有时区的当前时间</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {TIMEZONES.map((tz) => (
              <div 
                key={tz} 
                className={`p-3 rounded-md border ${
                  tz === selectedTimezone ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="font-medium">{tz}</div>
                <div className="text-gray-700">
                  {formatTime(currentTime, "yyyy-MM-dd HH:mm:ss", tz)}
                </div>
                <div className="text-sm text-gray-500">
                  UTC偏移: {getTimezoneOffsetString(tz)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <h3 className="font-semibold mb-2">Date-fns 格式化参考</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">格式</th>
              <th className="p-2 border text-left">输出</th>
              <th className="p-2 border text-left">描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border font-mono">yyyy</td>
              <td className="p-2 border">{format(currentTime, "yyyy")}</td>
              <td className="p-2 border">四位数年份</td>
            </tr>
            <tr>
              <td className="p-2 border font-mono">MM</td>
              <td className="p-2 border">{format(currentTime, "MM")}</td>
              <td className="p-2 border">两位数月份 (01-12)</td>
            </tr>
            <tr>
              <td className="p-2 border font-mono">dd</td>
              <td className="p-2 border">{format(currentTime, "dd")}</td>
              <td className="p-2 border">两位数日期 (01-31)</td>
            </tr>
            <tr>
              <td className="p-2 border font-mono">HH</td>
              <td className="p-2 border">{format(currentTime, "HH")}</td>
              <td className="p-2 border">两位数小时 (24小时制, 00-23)</td>
            </tr>
            <tr>
              <td className="p-2 border font-mono">mm</td>
              <td className="p-2 border">{format(currentTime, "mm")}</td>
              <td className="p-2 border">两位数分钟 (00-59)</td>
            </tr>
            <tr>
              <td className="p-2 border font-mono">ss</td>
              <td className="p-2 border">{format(currentTime, "ss")}</td>
              <td className="p-2 border">两位数秒钟 (00-59)</td>
            </tr>
            <tr>
              <td className="p-2 border font-mono">XXX</td>
              <td className="p-2 border">{format(currentTime, "XXX")}</td>
              <td className="p-2 border">UTC偏移</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
