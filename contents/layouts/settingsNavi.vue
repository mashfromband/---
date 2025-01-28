<template>
  <BreadcrumbLinks v-bind:links="computedLinks" />
  <div class="flex flex-col mx-auto">
    <UHeaderLinks :links="sublinks" class="lg:hidden"
      :ui="{
        wrapper:'bg-el_yellow-400 dark:bg-gray-800/50 px-3',
        base: 'flex items-center py-3.5 font-medium text-sm',
        active: 'text-black',
        inactive: 'hover:text-black',
        default: { popover: { mode: 'click', } }
      }"
    />
  </div>
  <!-- 広告SP -->
  <div class="lg:hidden flex justify-center">
    <AdNinja sizeType="320x50" adScriptUrl="https://adm.shinobi.jp/s/274dbcba2dcfb5195524bbf11eedfc35" />
  </div>
  <!--背景あり-->
  <UContainer class="px-2"
  >
    <UPage class=""
    :ui="{
      wrapper:'md:grid-cols-5 lg:grid-cols-3',
      left: 'md:col-span-2 lg:col-span-1',
      center: {
        narrow: 'lg:col-span-3 lg:col-span-2',
        base: 'lg:col-span-3 lg:col-span-2',
        full: 'lg:col-span-3 lg:col-span-2'
      }
    }"
    >
      <template #left>
        <UAside class="-mx-4 p-4 lg:mx-0 bg-el_yellow-400 dark:bg-gray-800/50" :ui="{wrapper:'lg:max-h-none min-w-[320px]'}">
          <div class="lg:hidden">
          <UVerticalNavigation :links="profLinks" />
          </div>
          <UDashboardSidebarLinks :links="sublinks" />
          <template #bottom>
            <div class="flex justify-center">
            <AdNinja sizeType="300x250" adScriptUrl="https://adm.shinobi.jp/s/568fb516ab3f7075b5cb26d53f9e408b" />
            </div>
          </template>
        </UAside>
      </template>
      <slot />
      <div class="hidden lg:flex justify-center mt-6">
        <AdNinja sizeType="728x90" adScriptUrl="https://adm.shinobi.jp/s/300aad1478728545a780346409a25c05" />
      </div>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">

// 背景画像
const bgImageUrl = useStaticCdnUrl("/img/logo_3_a.png").staticCdnUrl;

//パンくずリンク
const links = useState<BreadcrumbLinkItem[]>('breadcrumblinks');
const isLinksUpdated = ref(false);
watch(links, (newLinks, oldLinks) => {
  if (newLinks !== oldLinks) {
    isLinksUpdated.value = true;
  }
});
const computedLinks = computed(() => {
  return isLinksUpdated.value ? links.value : ProfileBreadcrumbLinkItems;
});

const profLinks = [[
  {
    label: "アカウント設定",
    to: "/home/settings",
    icon:"i-heroicons-cog-8-tooth",
  }
],[]
];

const route = useRoute()

const sublinks = [
  {
    label: 'アカウント設定',
    defaultOpen: false,
    children: [
      {
        label: '基本設定',
        to: "/home/settings",
        icon:"i-heroicons-cog-8-tooth",
        /*
      },{
        label: "プロフィール公開設定",
        to: "/home/settings/profile",
        icon:"i-heroicons-globe-alt",
        */
      }
    ]
  }
]
</script>
<style scoped>
:deep(a.text-primary)  {
  color: #463eda !important;
}
</style>
