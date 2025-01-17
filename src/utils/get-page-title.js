/**
 * generate page title for web application
 * important for SEO (Search Engine Optimization)
 */

// base title for the web application
const title = 'UH Auction'

// return base title if no page title is provided
export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}
