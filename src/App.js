import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

function App() {
  const [text, setText] = useState("");
  const [grade, setGrade] = useState("ielts_task2");
  const [title, setTitle] = useState("");
  const [modelContent, setModelContent] = useState("");
  const [isNeedSynonyms, setIsNeedSynonyms] = useState("false");
  const [correctVersion, setCorrectVersion] = useState("advanced");
  const [isNeedEssayReport, setIsNeedEssayReport] = useState("true");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("http://localhost:8000/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          grade,
          title,
          modelContent,
          isNeedSynonyms,
          correctVersion,
          isNeedEssayReport
        }),
      });
      const data = await resp.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "请求失败" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8 tracking-tight text-gray-900">雅思作文自动评分</h1>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* 左侧：表单区 */}
        <div className="flex-1">
          <div className="rounded-2xl shadow-xl bg-white p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">作文评分</h2>
            {/* 表单内容 */}
            <div className="mb-2">
              <label className="font-medium">作文等级：</label>
              <select value={grade} onChange={e => setGrade(e.target.value)} className="border rounded p-1 ml-2">
                <option value="ielts_task2">雅思Task2</option>
                <option value="cet4">CET4</option>
                <option value="cet6">CET6</option>
                <option value="toefl">TOEFL</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="font-medium">是否查询同义词：</label>
              <select value={isNeedSynonyms} onChange={e => setIsNeedSynonyms(e.target.value)} className="border rounded p-1 ml-2">
                <option value="false">否</option>
                <option value="true">是</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="font-medium">作文批改版本：</label>
              <select value={correctVersion} onChange={e => setCorrectVersion(e.target.value)} className="border rounded p-1 ml-2">
                <option value="basic">基础</option>
                <option value="advanced">高级</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="font-medium">是否返回写作报告：</label>
              <select value={isNeedEssayReport} onChange={e => setIsNeedEssayReport(e.target.value)} className="border rounded p-1 ml-2">
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="font-medium">作文标题：</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="border rounded p-1 ml-2 w-3/4" />
            </div>
            <div className="mb-2">
              <label className="font-medium">范文：</label>
              <textarea value={modelContent} onChange={e => setModelContent(e.target.value)} className="border rounded p-1 ml-2 w-3/4 h-16" />
            </div>
            <div className="mb-2">
              <label className="font-medium">作文内容：</label>
              <TextareaAutosize
                className="w-full h-40 p-2 border rounded"
                placeholder="请输入雅思作文..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-xl mt-4 w-full text-lg font-semibold shadow hover:bg-blue-600 transition"
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
            >
              {loading ? "评分中..." : "提交评分"}
            </button>
          </div>
        </div>
        {/* 右侧：评分反馈区 */}
        <div className="flex-1">
          {result && !result.error && (
            <div className="grid gap-6">
              {/* 总分与各项分数 */}
              <div className="rounded-2xl shadow-xl bg-white p-8 flex flex-col items-center">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">{result.score}</div>
                <div className="text-lg text-gray-500 mb-4">总分</div>
                {result.majorScore && (
                  <div className="grid grid-cols-2 gap-4 w-full mb-4">
                    <div>
                      <div className="text-gray-700 font-semibold">语法分</div>
                      <div className="text-2xl text-gray-900">{result.majorScore.grammarScore}</div>
                      <div className="text-xs text-gray-500">{result.majorScore.grammarAdvice}</div>
                    </div>
                    <div>
                      <div className="text-gray-700 font-semibold">词汇分</div>
                      <div className="text-2xl text-gray-900">{result.majorScore.wordScore}</div>
                      <div className="text-xs text-gray-500">{result.majorScore.wordAdvice}</div>
                    </div>
                    <div>
                      <div className="text-gray-700 font-semibold">结构分</div>
                      <div className="text-2xl text-gray-900">{result.majorScore.structureScore}</div>
                      <div className="text-xs text-gray-500">{result.majorScore.structureAdvice}</div>
                    </div>
                    <div>
                      <div className="text-gray-700 font-semibold">话题分</div>
                      <div className="text-2xl text-gray-900">{result.majorScore.topicScore}</div>
                    </div>
                  </div>
                )}
                <div className="w-full text-center text-base text-blue-700 font-medium bg-blue-50 rounded-xl py-2 mt-2">{result.advice}</div>
              </div>
              {/* 句子逐句反馈 */}
              {result.essayFeedback && result.essayFeedback.sentsFeedback && (
                <div className="rounded-2xl shadow-xl bg-white p-6">
                  <div className="text-xl font-bold mb-4 text-gray-900">句子逐句反馈</div>
                  <div className="divide-y divide-gray-200">
                    {result.essayFeedback.sentsFeedback.map((item, idx) => (
                      <div key={idx} className="py-3">
                        <div className="text-gray-800 font-medium mb-1">原句：{item.rawSent}</div>
                        {item.sentFeedback && (
                          <div className="text-red-600 text-sm mb-1">建议：{item.sentFeedback}</div>
                        )}
                        {item.errorPosInfos && item.errorPosInfos.length > 0 && (
                          <div className="text-blue-600 text-xs mb-1">
                            {item.errorPosInfos
                              .filter(e => e.type === "synonym" && e.target && e.target.length > 0)
                              .map((e, i) => (
                                <div key={i}>
                                  推荐同义词：{e.target.join("、")}
                                </div>
                              ))}
                          </div>
                        )}
                        <div className="text-gray-400 text-xs">得分：{item.sentScore}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* 写作报告 */}
              {result.essayReport && (
                <div className="rounded-2xl shadow-xl bg-white p-6">
                  <div className="text-xl font-bold mb-4 text-gray-900">写作报告</div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>平均句长：<span className="font-semibold">{result.essayReport.avgSentLen}</span></div>
                    <div>句长丰富度：<span className="font-semibold">{result.essayReport.stdSentLen}</span></div>
                    <div>句数：<span className="font-semibold">{result.essayReport.sentNum}</span></div>
                    <div>逻辑连接词数：<span className="font-semibold">{result.essayReport.conjWordNum}</span></div>
                  </div>
                  <div className="mb-2">词汇分布建议：<span dangerouslySetInnerHTML={{__html: result.essayReport.lexicalDistribution?.advice || ''}} /></div>
                  <div className="mb-2">句长建议：{result.essayReport.avgSentLenAdvice}</div>
                  <div className="mb-2">句长丰富度建议：{result.essayReport.stdSentLenAdvice}</div>
                  <div className="mb-2">结构分建议：{result.essayReport.sentenceStructureAdvice || result.essayReport.sentComplexInfo?.sentenceStructureAdvice}</div>
                  {result.essayReport.conjTypeInfos && (
                    <div className="mt-2">
                      <div className="font-medium">逻辑连接词类型分布：</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.essayReport.conjTypeInfos.map((c, i) => (
                          <span key={i} className="bg-gray-100 rounded px-2 py-1 text-sm">{c.name}: {c.count} ({(c.percent * 100).toFixed(1)}%)</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* 其它特征分 */}
              {result.allFeatureScore && (
                <div className="rounded-2xl shadow-xl bg-white p-6">
                  <div className="text-xl font-bold mb-4 text-gray-900">其它特征分</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(result.allFeatureScore).map(([k, v]) => (
                      <div key={k} className="text-gray-700">{k}: <span className="font-semibold">{v}</span></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* 错误提示 */}
          {result && result.error && (
            <div className="rounded-2xl shadow-xl bg-white p-8 text-red-600 text-lg font-bold text-center">
              {result.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 