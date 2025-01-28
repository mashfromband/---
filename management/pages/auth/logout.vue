<script setup lang="ts">
import { storeToRefs } from 'pinia';

const accessTokenCookie = useCookie("RL_M_ACT");
const refreshTokenCookie = useCookie("RL_M_RFT");
accessTokenCookie.value = null;
refreshTokenCookie.value = null;

// TODO: API 叩く

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);
isLogin.value = false;

const { setUserId, setNickName, setMailAddress } = useUserInfo();
setUserId("");
setNickName("");
setMailAddress("");

const { clearRole } = useUserRoleStore();
clearRole();

await navigateTo("/");
</script>
