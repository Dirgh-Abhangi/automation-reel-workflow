# Automation Reel Workflow

A production-ready, clean automation workflow for generating faceless short-form video reels, powered by AI voice synthesis, 2D animation, timing engines, and narrative templates.

---

## 📁 Repository Structure

```
├── faceless-shorts/             # Core Skill Engine
│   ├── SKILL.md                 # Master skill reference & architecture
│   ├── scripts/                 # Voice synthesis, estimation, words alignment
│   ├── styles/                  # 10 modular animation styles (2D, deep-dive, suspense, etc.)
│   └── references/              # Style sheets, briefs, and execution guides
├── millbrook-lift-2d/           # Reference Implementation & Visual Assets
│   ├── assets/                  # Keyframe animation layers
│   ├── data/                    # Timing, lip-sync cues, and word data JSONs
│   ├── review/                  # Verified animation inspector stills & style sheets
│   ├── renders/                 # Cover page renders
│   ├── src/                     # Canvas & WebGL animation engine
│   └── tools/                   # Audio alignment and scene assembly tools
├── chats/                       # Complete Antigravity Conversation Transcripts
│   ├── 1_Faceless_Short_Animation_Workflow_Plan.md
│   ├── 2_Resume_Faceless_Short_Animation_Workflow.md
│   └── raw/                     # Original SQLite databases (.db) and raw JSONL logs
├── generate_master_manifest.py  # Pipeline manifest generator
└── PLAN.md                      # Milestone & roadmap tracker
```

---

## 🚀 Quick Start in Google Cloud Shell or Any Linux Server

```bash
# Clone the repository
git clone https://github.com/Dirgh-Abhangi/automation-reel-workflow.git
cd automation-reel-workflow

# Install Linux system dependencies (ffmpeg & audio tools)
sudo apt-get update && sudo apt-get install -y ffmpeg

# Inspect the core skill
cat faceless-shorts/SKILL.md
```

---

## 🎨 Available Animation Styles

1. **Detailed 2D (`detailed-2d`)**
2. **Deep Dive (`deep-dive`)**
3. **Illustrated Suspense (`illustrated-suspense`)**
4. **Inside Out (`inside-out`)**
5. **Night File (`night-file`)**
6. **Paper Atlas (`paper-atlas`)**
7. **Roblox Story (`roblox-story`)**
8. **Stick Story (`stick-story`)**
9. **Tall Tale (`tall-tale`)**
10. **Thriller 2D (`thriller-2d`)**
