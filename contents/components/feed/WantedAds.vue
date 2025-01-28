<template>
  <FeedCardList :feed=wantedAdsList />
</template>

<script setup lang="ts">
import type { paths } from '~/types/api/contents';

const props = defineProps<{
  limit: string;
}>();

const wantedAdsList = ref({
  title:'新着求人',
  img:'',
  icon:'i-heroicons-building-office-2',
  list: undefined as {
    name: string;
    description: string;
    tag: string;
    star: boolean;
    to: string;
  }[] | undefined,
});

const loadWantedAdList = async ()=>{
  type ResponseSuccess = paths["/wanted-ads"]["get"]["responses"][200]["content"]["application/json"];
  const apiEndpoint = useApiEndpoint();
  const { data, error } = await useCallApi<ResponseSuccess>(
    apiEndpoint.value.endpoint + "/v1/wanted-ads",
    {
      method: "get",
      query: { limit: props.limit, sort: "-id" },
    },
  );
  if(!data.value) {
    return;
  }

  wantedAdsList.value.list = data.value.ads.map(function(wantedAd) {
    return {
      name: wantedAd.position,
      description: wantedAd.details ,
      tag: wantedAd.recruitCompanyName,
      star: false,
      to: `/wanted_ads/${wantedAd.id}`
    };
  });
}

onMounted(async () => {
  await loadWantedAdList();
});
</script>
