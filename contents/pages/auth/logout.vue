<script setup lang="ts">
definePageMeta({
  noAuthRequired: true
});

const accessTokenCookie = useCookie("RL_ACT");
const refreshTokenCookie = useCookie("RL_RFT");
accessTokenCookie.value = null;
refreshTokenCookie.value = null;

// TODO: API 叩く

useUserInfo().clear();
await navigateTo("/");
</script>
