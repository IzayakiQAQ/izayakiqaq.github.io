# 博士生个人学术主页（Hexo + Butterfly）

这是一个以“个人学术主页为主、Blog 为独立内容频道”为定位的静态站点。根路径展示作者、研究方向、代表项目、论文与近期文章；Butterfly 继续负责文章阅读、目录、代码高亮、KaTeX 数学公式、搜索、分类、标签、归档与深色模式。

当前依赖基于 Hexo 8.1.2 与 hexo-theme-butterfly 5.6.0。主题通过 npm 安装，并使用仓库根目录的 `_config.butterfly.yml` 覆盖配置；不要直接修改 `node_modules/hexo-theme-butterfly`。

## 安装与本地预览

需要 Node.js 20 或更高版本（部署工作流使用 Node.js 22）。

```bash
npm install
npx hexo clean
npx hexo generate
npx hexo server
```

浏览器打开 `http://localhost:4000/`。也可以使用：

```bash
npm run check
```

## 首次使用：替换个人资料

大部分个人信息只需修改一个文件：`source/_data/profile.yml`。

需要替换的统一占位符有：

```text
{{AUTHOR_NAME}}
{{AUTHOR_NAME_CN}}
{{UNIVERSITY}}
{{DEPARTMENT}}
{{LABORATORY}}
{{EMAIL}}
{{GITHUB_URL}}
{{GOOGLE_SCHOLAR_URL}}
{{ORCID_URL}}
{{CV_URL}}
{{PROFILE_PHOTO}}
{{RESEARCH_SUMMARY}}
```

头像建议放在 `source/img/profile.jpg`，然后设置：

```yaml
avatar: /img/profile.jpg
```

首页简介采用 `focus` 数组生成标签，适合填写 3–6 个简短关键词；`bio` 用作站点摘要，保持一行即可。教育、研究经历、学术服务和奖项也在 `profile.yml` 中维护；不需要的占位项可以直接删除。

## 维护研究内容

### 添加研究方向

编辑 `source/_data/research.yml`。每个条目的 `id` 会成为 Research 页面的锚点；请使用小写字母、数字和连字符，并保持唯一。

### 添加论文

编辑 `source/_data/publications.yml`。推荐字段：

```yaml
- title:
  authors:
  venue:
  year:
  status: Published # Published / Accepted / Preprint / Under Review
  type: journal     # journal / conference / preprint
  selected: true    # 是否显示在首页
  pdf:
  arxiv:
  code:
  project:
  doi:
  abstract:
```

完整列表由 Publications 页面自动生成，并支持 Journal、Conference、Preprint 前端筛选。不要填入未核实的引用次数、影响因子或录用信息。

### 添加项目

编辑 `source/_data/projects.yml`：

```yaml
- title:
  description:
  image: /img/projects/example.jpg
  tags:
    - Keyword
  paper:
  code:
  demo:
  status:
  selected: true
```

图片留空时会使用轻量的排版占位图，不会产生失效图片请求。

## 创建博客文章

```bash
npx hexo new post "article-title"
```

在生成的 Markdown 头部填写标题、摘要、分类和标签。建议使用四个主分类之一：

- `Learning Notes`
- `Research Thoughts`
- `Technology`
- `Life`

启用文章公式时可在 front matter 中加入 `katex: true`。Markdown 公式示例：

```markdown
$$
E = mc^2
$$
```

代码块使用常规围栏语法并标注语言。首页自动提取最近三篇文章，Blog 页面显示更完整的近期列表。

## 添加 CV

1. 将已核实的 PDF 放到 `source/files/cv.pdf`。
2. 在 `source/_data/profile.yml` 中设置 `cv: /files/cv.pdf`。
3. 重新构建站点。

没有真实 CV 时，页面会显示明确的 `{{CV_URL}}` 占位提示，按钮不会跳转到伪造文件。

## GitHub Pages 部署

仓库已包含 `.github/workflows/pages.yml`。工作流会安装依赖、生成 `public/`、上传构建产物并部署到 GitHub Pages。

1. 将仓库推送到 GitHub，默认分支使用 `main`。
2. 在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**。
3. 推送到 `main`，或手动运行 “Deploy Hexo site to GitHub Pages”。

工作流会自动识别两种地址：

- 用户站点：`https://username.github.io/`
- 项目站点：`https://username.github.io/repository/`

因此无需手工写死子路径，导航、自定义 CSS/JS、文章和数据链接都会根据 Hexo 的 `root` 生成。

使用自定义域名时，在 `source/CNAME` 中只写域名，例如 `example.com`，并完成 DNS 配置。工作流会自动将站点 `url` 设为该 HTTPS 域名、将 `root` 设为 `/`。不要将令牌、邮箱密码或 `.env` 文件提交到仓库。

## 自定义文件说明

- `_config.yml`：Hexo 站点、链接、搜索、RSS、代码高亮和生成器配置。
- `_config.butterfly.yml`：Butterfly 的站点级覆盖配置。
- `scripts/academic-pages.js`：从 YAML 生成首页与学术页面，并处理部署子路径。
- `source/_data/profile.yml`：集中式作者资料。
- `source/_data/research.yml`：研究方向数据。
- `source/_data/publications.yml`：论文数据。
- `source/_data/projects.yml`：项目数据。
- `source/css/custom.css`：学术主页视觉样式与深色/移动端适配。
- `source/js/academic.js`：论文筛选与搜索入口交互。
- `source/index.md`：自定义首页入口。
- `source/{research,publications,projects,blog,about,cv}/index.md`：各独立页面入口。
- `source/_posts/`：Markdown 博客文章。
- `.github/workflows/pages.yml`：GitHub Pages 自动部署。

不要修改以下内容：

- `node_modules/` 中的主题或依赖源码；更新主题应修改 `package.json` 并重新安装。
- `public/` 中的生成结果；它会在每次构建时重新创建。
- 主题核心模板；本项目没有复制或覆盖 Butterfly 模板。

## 清理示例内容

确认页面、搜索、公式和代码高亮正常后，可以删除 `source/_posts/placeholder-*.md`，并将三个 YAML 数据文件中的 `[PLACEHOLDER]` 条目替换为真实内容。替换前不要将占位论文、项目或经历当作真实成果发布。
