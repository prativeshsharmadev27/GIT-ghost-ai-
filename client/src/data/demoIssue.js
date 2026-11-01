export const demoIssues = [
  {
    id: 'mobile-navbar',
    category: 'RESPONSIVE UI',
    title: 'Fix navbar overlapping content on mobile devices',
    body: 'The navigation bar overlaps the main content area on screens smaller than 768px. On smaller devices the header should remain easy to use without covering page content. Please investigate the responsive styles and add a regression check if the project has UI tests.',
    repository: 'Sample React application with a responsive navigation bar.',
    labels: ['good first issue', 'responsive design'],
  },
  {
    id: 'safe-git-undo',
    category: 'GIT BASICS',
    title: 'Add a beginner-safe guide for undoing a Git commit',
    body: 'New contributors sometimes commit to the wrong branch or notice a mistake after committing. Add a clear guide that distinguishes undoing an unpushed local commit from undoing a commit that has already been shared. Explain when git revert is safer than git reset, warn before destructive commands, and include a small practice example.',
    repository: 'Sample open-source project with a beginner Git learning center.',
    labels: ['documentation', 'git', 'good first issue'],
  },
  {
    id: 'merge-conflict-walkthrough',
    category: 'COLLABORATION',
    title: 'Create a hands-on guide to resolving a Git merge conflict',
    body: 'The contributor guide explains branches but does not show what to do when two branches edit the same lines. Add a beginner-friendly walkthrough that shows how to spot conflict markers, compare both changes, remove the markers after choosing the correct result, run relevant tests, and confirm the conflict is resolved. Include safe commands such as git status and git diff, and explain that contributors should ask the maintainers when the intended behavior is unclear.',
    repository: 'Sample collaborative project with GitHub contribution documentation.',
    labels: ['documentation', 'git', 'collaboration'],
  },
]

export default demoIssues[0]
