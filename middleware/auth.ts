export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn, user, session, fetch, clear } = useUserSession();
    
    if (!loggedIn.value) {
        console.log(user.value, session.value)
        return navigateTo('/login');
    }
})