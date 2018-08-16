import createHistory from 'history/createBrowserHistory'

// we shouldn't need history in server, so undefined is fine.
export default (typeof window !== 'undefined' ? createHistory() : undefined)
