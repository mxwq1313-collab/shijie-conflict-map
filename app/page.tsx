"use client";

import { ChangeEvent, useMemo, useState } from "react";

type Step = "welcome" | "import" | "context" | "loading" | "result";
type Lens = "self" | "other" | "observer";

const sampleChat = `我：你是不是又不想回我？
对方：我刚刚在忙，现在真的不想聊。
我：每次都这样，一有问题你就消失。
对方：我只是想先冷静一下，你一直追着问让我压力很大。
我：所以我的感受就不重要了吗？
对方：不是，我怕现在说下去会更糟。`;

const goals = ["理解发生了什么", "换个视角", "准备一次沟通", "表达边界", "先停下来"];
const topics = ["回复与忽视", "沟通方式", "时间与陪伴", "信任", "边界", "其他"];

const lensContent: Record<Lens, { eyebrow: string; title: string; body: string; need: string }> = {
  self: {
    eyebrow: "我的视角",
    title: "“暂停”可能被你听成了“拒绝”",
    body: "当对方没有立刻回应，你可能更想确认这段关系是否仍然安全。连续追问不是为了赢，而是在寻找确定感。",
    need: "可能在保护：被重视、确定感、连接",
  },
  other: {
    eyebrow: "对方的可能视角",
    title: "“追问”可能被对方听成了“没有空间”",
    body: "对方说想冷静，可能是在避免说出更伤人的话。面对连续消息，对方可能感到自己没有整理情绪的余地。",
    need: "可能在保护：空间、自主、避免升级",
  },
  observer: {
    eyebrow: "旁观者视角",
    title: "双方都在降风险，只是方向相反",
    body: "一方通过靠近来确认安全，另一方通过拉开距离来避免失控。两种方式相撞后，反而验证了双方原本的担心。",
    need: "可以验证：暂停多久、何时回来、如何确认连接",
  },
};

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

function Progress({ step }: { step: Step }) {
  const order: Step[] = ["import", "context", "loading", "result"];
  const index = Math.max(0, order.indexOf(step));
  return (
    <div className="progress" aria-label={`复盘进度，第 ${index + 1} 步，共 4 步`}>
      {["整理对话", "补充背景", "分析脉络", "查看结果"].map((label, i) => (
        <div className={`progress-item ${i <= index ? "is-active" : ""}`} key={label}>
          <span>{i + 1}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

function Header({ onReset }: { onReset: () => void }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={onReset} aria-label="返回释结首页">
        <LogoMark />
        <strong>释结</strong>
        <em>冲突复盘工具</em>
      </button>
      <div className="header-note">
        <span className="privacy-dot" />
        本地演示 · 内容不上传
      </div>
    </header>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <main className="welcome">
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">不是替你评理</p>
          <h1>把争吵，慢慢<br />看清楚。</h1>
          <p className="hero-lead">
            上传一段聊天，分开事实与解释，看见双方可能在保护什么，
            再决定下一步要靠近、设下边界，还是先停一停。
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onStart}>
              开始一次复盘
              <span aria-hidden="true">→</span>
            </button>
            <span className="microcopy">约 3 分钟 · 无需登录</span>
          </div>
        </div>

        <div className="mirror-card" aria-label="多视角分析示例">
          <div className="mirror-topline">
            <span>一句话，三种听法</span>
            <b>示例</b>
          </div>
          <blockquote>“我现在不想聊。”</blockquote>
          <div className="mirror-seam" />
          <div className="mirror-sides">
            <div>
              <small>我可能听见</small>
              <strong>“你不在乎我。”</strong>
              <p>于是更想靠近、确认。</p>
            </div>
            <div>
              <small>对方可能想说</small>
              <strong>“我怕事情更糟。”</strong>
              <p>于是更想暂停、退开。</p>
            </div>
          </div>
          <p className="mirror-foot">两种解释都不是定论，只有新的验证方向。</p>
        </div>
      </section>

      <section className="trust-strip" aria-label="产品原则">
        <div><b>01</b><span>不判断谁输谁赢</span></div>
        <div><b>02</b><span>推测都标明证据</span></div>
        <div><b>03</b><span>你随时可以纠正</span></div>
      </section>
    </main>
  );
}

function ImportStep({
  text,
  setText,
  files,
  setFiles,
  onContinue,
}: {
  text: string;
  setText: (value: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  onContinue: () => void;
}) {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [confirmed, setConfirmed] = useState(false);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []).slice(0, 20));
  }

  const canContinue = confirmed && (text.trim().length > 24 || files.length > 0);

  return (
    <main className="flow-shell">
      <Progress step="import" />
      <section className="flow-card">
        <div className="section-heading">
          <span>01 · 整理对话</span>
          <h1>放进最关键的那一段</h1>
          <p>不必上传全部聊天。选择矛盾发生前后、双方表达最集中的连续片段。</p>
        </div>

        <div className="segmented" role="tablist" aria-label="选择导入方式">
          <button className={mode === "text" ? "active" : ""} onClick={() => setMode("text")} role="tab">
            粘贴文字
          </button>
          <button className={mode === "image" ? "active" : ""} onClick={() => setMode("image")} role="tab">
            选择截图
          </button>
        </div>

        {mode === "text" ? (
          <div className="input-panel">
            <label htmlFor="chat-text">聊天内容</label>
            <textarea
              id="chat-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={"我：……\n对方：……\n我：……"}
              rows={11}
            />
            <div className="input-meta">
              <span>{text.length} 字</span>
              <button className="text-button" onClick={() => setText(sampleChat)}>使用示例对话</button>
            </div>
          </div>
        ) : (
          <div className="upload-panel">
            <input id="screenshots" type="file" accept="image/*" multiple onChange={handleFiles} />
            <label htmlFor="screenshots">
              <span className="upload-glyph">↥</span>
              <strong>{files.length ? `已选择 ${files.length} 张截图` : "选择 5—20 张连续截图"}</strong>
              <small>演示版仅在本地显示文件，不会上传，也暂不执行 OCR</small>
            </label>
            {files.length > 0 && (
              <div className="file-list">
                {files.slice(0, 4).map((file, index) => <span key={file.name}>{index + 1}. {file.name}</span>)}
                {files.length > 4 && <span>还有 {files.length - 4} 张</span>}
              </div>
            )}
          </div>
        )}

        <label className="consent-row">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
          <span>我有权使用这段内容，并已尽量删除无关第三方信息。</span>
        </label>

        <div className="privacy-note">
          <span aria-hidden="true">◎</span>
          <p><strong>当前演示不会发送或保存内容。</strong>正式版将默认遮盖手机号、地址等敏感信息，并允许一键删除。</p>
        </div>

        <div className="flow-actions">
          <span>{!canContinue ? "添加对话并确认后继续" : "可以开始补充背景了"}</span>
          <button className="primary-button" disabled={!canContinue} onClick={onContinue}>下一步 <b>→</b></button>
        </div>
      </section>
    </main>
  );
}

function ContextStep({
  emotion,
  setEmotion,
  relation,
  setRelation,
  selectedGoals,
  setSelectedGoals,
  selectedTopic,
  setSelectedTopic,
  onAnalyze,
}: {
  emotion: number;
  setEmotion: (value: number) => void;
  relation: string;
  setRelation: (value: string) => void;
  selectedGoals: string[];
  setSelectedGoals: (value: string[]) => void;
  selectedTopic: string;
  setSelectedTopic: (value: string) => void;
  onAnalyze: () => void;
}) {
  function toggleGoal(goal: string) {
    setSelectedGoals(selectedGoals.includes(goal)
      ? selectedGoals.filter((item) => item !== goal)
      : [...selectedGoals, goal].slice(0, 2));
  }

  return (
    <main className="flow-shell">
      <Progress step="context" />
      <section className="flow-card">
        <div className="section-heading">
          <span>02 · 补充背景</span>
          <h1>聊天之外，还有什么重要？</h1>
          <p>这些信息只用于控制分析重点，不会被拿来给任何人贴标签。</p>
        </div>

        <div className="question-block">
          <label>你们是什么关系？</label>
          <div className="chips">
            {["伴侣", "暧昧中", "前任", "朋友", "家人", "其他"].map((item) => (
              <button key={item} className={relation === item ? "selected" : ""} onClick={() => setRelation(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="question-block">
          <label>这次矛盾最接近哪个主题？</label>
          <div className="chips">
            {topics.map((item) => (
              <button key={item} className={selectedTopic === item ? "selected" : ""} onClick={() => setSelectedTopic(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="question-block">
          <label>你希望这次复盘帮你做什么？ <small>最多选 2 项</small></label>
          <div className="chips wide">
            {goals.map((goal) => (
              <button key={goal} className={selectedGoals.includes(goal) ? "selected" : ""} onClick={() => toggleGoal(goal)}>
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="emotion-block">
          <div>
            <label htmlFor="emotion">现在的情绪强度</label>
            <strong>{emotion}<small>/10</small></strong>
          </div>
          <input
            id="emotion"
            type="range"
            min="0"
            max="10"
            value={emotion}
            onChange={(event) => setEmotion(Number(event.target.value))}
            style={{ "--range-progress": `${emotion * 10}%` } as React.CSSProperties}
          />
          <div className="range-labels"><span>平静</span><span>很难承受</span></div>
          {emotion >= 8 && <p className="emotion-tip">现在的强度比较高。结果会先帮助你降速，而不是催你立刻回复。</p>}
        </div>

        <div className="flow-actions">
          <span>你可以随时回来修改</span>
          <button
            className="primary-button"
            disabled={!relation || !selectedTopic || selectedGoals.length === 0}
            onClick={onAnalyze}
          >
            开始复盘 <b>→</b>
          </button>
        </div>
      </section>
    </main>
  );
}

function LoadingStep({ phase }: { phase: number }) {
  const phases = ["分开事实与解释", "尝试理解双方视角", "寻找冲突循环", "整理下一步选择"];
  return (
    <main className="loading-shell">
      <Progress step="loading" />
      <section className="loading-card" aria-live="polite">
        <div className="breathing-mark"><LogoMark /></div>
        <p className="kicker">正在慢慢拆开这个结</p>
        <h1>{phases[Math.min(phase, phases.length - 1)]}</h1>
        <div className="loading-lines">
          {phases.map((item, index) => (
            <span key={item} className={index <= phase ? "done" : ""}>
              <i>{index < phase ? "✓" : index + 1}</i>{item}
            </span>
          ))}
        </div>
        <small>分析不是定论。你稍后可以查看证据并纠正我们。</small>
      </section>
    </main>
  );
}

function Result({
  text,
  emotion,
  lens,
  setLens,
  draft,
  setDraft,
  onReset,
}: {
  text: string;
  emotion: number;
  lens: Lens;
  setLens: (lens: Lens) => void;
  draft: string;
  setDraft: (draft: string) => void;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(
    () => text.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 3),
    [text],
  );

  async function copyDraft() {
    await navigator.clipboard?.writeText(draft);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="result-shell">
      <Progress step="result" />
      <section className="result-hero">
        <div>
          <span className="result-label">复盘完成 · 演示分析</span>
          <h1>这不像是谁不在乎谁，<br />更像是两种保护方式撞在了一起。</h1>
          <p>以下推测基于你提供的片段，不能确认任何人的真实意图。点击视角和证据，看看哪些与你的经历相符。</p>
        </div>
        <div className="temperature-card">
          <small>建议行动节奏</small>
          <strong>{emotion >= 8 ? "先暂停" : emotion >= 5 ? "慢一点" : "可以澄清"}</strong>
          <span>输入情绪强度 {emotion}/10</span>
        </div>
      </section>

      <div className="result-grid">
        <section className="result-card facts-card">
          <div className="card-heading"><span>01</span><div><small>先看事实</small><h2>对话里明确发生了什么</h2></div></div>
          <div className="timeline">
            {(lines.length ? lines : sampleChat.split("\n").slice(0, 3)).map((line, index) => (
              <div key={`${line}-${index}`}>
                <i>{index + 1}</i>
                <p>{line.replace(/^(我|对方)[:：]\s*/, "")}</p>
                <button title="演示版证据来自输入原文">查看原话</button>
              </div>
            ))}
          </div>
          <p className="card-footnote">这里不包含“故意冷落”“总是逃避”等意图判断。</p>
        </section>

        <section className="result-card lens-card">
          <div className="card-heading"><span>02</span><div><small>再换视角</small><h2>同一段对话，可能怎样被听见</h2></div></div>
          <div className="lens-tabs" role="tablist">
            {([
              ["self", "我的视角"],
              ["other", "对方可能"],
              ["observer", "旁观者"],
            ] as [Lens, string][]).map(([key, label]) => (
              <button key={key} role="tab" className={lens === key ? "active" : ""} onClick={() => setLens(key)}>
                {label}
              </button>
            ))}
          </div>
          <div className="lens-body">
            <small>{lensContent[lens].eyebrow}</small>
            <h3>{lensContent[lens].title}</h3>
            <p>{lensContent[lens].body}</p>
            <div><span>可能</span>{lensContent[lens].need}</div>
          </div>
        </section>

        <section className="result-card cycle-card">
          <div className="card-heading"><span>03</span><div><small>找到循环</small><h2>矛盾是怎样被一步步放大的</h2></div></div>
          <div className="cycle">
            <div><b>担心被忽视</b><small>内部感受</small></div>
            <span>→</span>
            <div><b>追问确认</b><small>靠近保护</small></div>
            <span>→</span>
            <div><b>感到压力</b><small>对方接收</small></div>
            <span>→</span>
            <div><b>暂停或沉默</b><small>退开保护</small></div>
          </div>
          <p className="cycle-return">于是，“我会被忽视”的担心变得更像真的。</p>
        </section>

        <section className="result-card common-card">
          <div className="card-heading"><span>04</span><div><small>可验证的部分</small><h2>你们可能不是目标不同</h2></div></div>
          <div className="common-columns">
            <div><small>共同目标</small><strong>不想让争吵继续恶化</strong></div>
            <div><small>真正分歧</small><strong>何时暂停，多久后回来</strong></div>
            <div><small>值得确认</small><strong>暂停是否意味着拒绝沟通</strong></div>
          </div>
        </section>

        <section className="result-card action-card">
          <div className="card-heading"><span>05</span><div><small>选择下一步</small><h2>不急着解决全部，只选一个动作</h2></div></div>
          <div className="action-options">
            <button className="recommended"><span>推荐</span><b>先确认暂停规则</b><small>既保留连接，也给彼此空间</small></button>
            <button><b>表达清晰边界</b><small>说明你能接受和不能接受什么</small></button>
            <button><b>今天先不回复</b><small>情绪很高时，暂停也是行动</small></button>
          </div>
          <label htmlFor="draft">可以从这句话开始</label>
          <textarea id="draft" rows={5} value={draft} onChange={(event) => setDraft(event.target.value)} />
          <div className="draft-actions">
            <span>草稿可以自由修改，发送前请再读一遍。</span>
            <button onClick={copyDraft}>{copied ? "已复制" : "复制草稿"}</button>
          </div>
        </section>
      </div>

      <section className="result-footer">
        <div><LogoMark /><p><strong>你比分析更了解这段关系。</strong><br />不准确的部分，可以不接受。</p></div>
        <button className="secondary-button" onClick={onReset}>删除内容并重新开始</button>
      </section>
    </main>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [emotion, setEmotion] = useState(6);
  const [relation, setRelation] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [phase, setPhase] = useState(0);
  const [lens, setLens] = useState<Lens>("observer");
  const [draft, setDraft] = useState("刚才的对话让我有些不安。我理解你可能需要先冷静，也希望暂停不会变成失联。我们能不能约定，今晚九点再聊十分钟？如果你还没准备好，也请告诉我一个大概时间。");

  function analyze() {
    setStep("loading");
    setPhase(0);
    [1, 2, 3].forEach((value, index) => {
      window.setTimeout(() => setPhase(value), 650 * (index + 1));
    });
    window.setTimeout(() => setStep("result"), 2900);
  }

  function reset() {
    setStep("welcome");
    setText("");
    setFiles([]);
    setEmotion(6);
    setRelation("");
    setSelectedGoals([]);
    setSelectedTopic("");
    setPhase(0);
    setLens("observer");
  }

  return (
    <div className="app-frame">
      <Header onReset={reset} />
      {step === "welcome" && <Welcome onStart={() => setStep("import")} />}
      {step === "import" && (
        <ImportStep text={text} setText={setText} files={files} setFiles={setFiles} onContinue={() => setStep("context")} />
      )}
      {step === "context" && (
        <ContextStep
          emotion={emotion}
          setEmotion={setEmotion}
          relation={relation}
          setRelation={setRelation}
          selectedGoals={selectedGoals}
          setSelectedGoals={setSelectedGoals}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          onAnalyze={analyze}
        />
      )}
      {step === "loading" && <LoadingStep phase={phase} />}
      {step === "result" && (
        <Result text={text} emotion={emotion} lens={lens} setLens={setLens} draft={draft} setDraft={setDraft} onReset={reset} />
      )}
    </div>
  );
}
