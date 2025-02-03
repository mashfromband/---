export class RedirectUrl {
    public static checkRedirectUrl(
        redirectUrl: string,
        allowRedirectUrls: string[],
    ) {
        if (redirectUrl.startsWith("/")) {
            return true;
        }

        for (let i = 0; i < allowRedirectUrls.length; i++) {
            if (redirectUrl.startsWith(allowRedirectUrls[i])) {
                return true;
            }
        }

        return false;
    }
}
