export const describeSkipIfGithubActions = (Boolean(process.env.GITHUB_ACTIONS) === true) ? describe.skip : describe
export const itSkipIfGithubActions = (Boolean(process.env.GITHUB_ACTIONS) === true) ? it.skip : it
