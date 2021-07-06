import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user,read:org',
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /**
     * @param  {object} user     User object
     * @param  {object} account  Provider account
     * @param  {object} profile  Provider profile
     * @return {boolean|string}  Return `true` to allow sign in
     *                           Return `false` to deny access
     *                           Return `string` to redirect to (eg.: "/unauthorized")
     */
    async signIn(user, account, profile) {
      const org = process.env.GITHUB_TEAM;
      const team = process.env.GITHUB_ORG;
      const username = profile.login;
      const accessToken = account.accessToken;

      const isAllowedToSignIn = await fetch(
        `https://api.github.com/orgs/${org}/teams/${team}/memberships/${username}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${accessToken}`,
          },
        }
      ).then((res) => res.ok);

      return isAllowedToSignIn;
    },
  },
});
