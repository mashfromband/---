<template>
  <AppHeader />
  <BreadcrumbLinks v-bind:links="links" />
  <UContainer
    :ui="{
      padding: 'px-0 sm:px-0',
    }"
  >
    <UPageGrid
      :ui="{
        wrapper:
          'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 xl:grid-cols-5',
      }"
    >
      <!--中央カラム-->
      <div class="flex flex-col col-span-full lg:col-span-4">
        <PageheaderGeneral title="会社概要" />
        <div class="lg:p-6 bg-gray-50 dark:bg-gray-800/50">
          <table class="tableBody">
            <tr class="tableRow">
              <th class="tableHead">社名</th>
              <td class="tableData">株式会社リアライズラーニング</td>
            </tr>
            <tr class="tableRow">
              <th class="tableHead">事業内容</th>
              <td class="tableData">
                https://www.realizelearning.net/ の運営、開発
              </td>
            </tr>
            <tr class="tableRow">
              <th class="tableHead">所在地</th>
              <td class="tableData">
                〒170-0003 東京都豊島区駒込1-41-9 花井ビル3F
              </td>
            </tr>
            <tr class="tableRow">
              <th class="tableHead">創立</th>
              <td class="tableData">2024年9月</td>
            </tr>
            <tr class="tableRow">
              <th class="tableHead">資本金</th>
              <td class="tableData">10万円</td>
            </tr>
            <tr class="tableRow">
              <th class="tableHead">代表者</th>
              <td class="tableData">代表取締役　山本　正樹</td>
            </tr>
          </table>
        </div>
      </div>
    </UPageGrid>
  </UContainer>
</template>

<script setup lang="ts">
// ランディングページ用専用layout読み込み
definePageMeta({
  layout: "landing",
  noAuthRequired: true,
});

// 表示データ読み込み
const { data: page } = await useAsyncData("index", () =>
  queryContent("/").findOne()
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "ページが見つかりません",
    fatal: true,
  });
}
</script>

<style scoped>
.font-color-black {
  color: #444;
}

.bg-colored {
  width: 75vw;
  margin: 0 auto;
  padding-bottom: 2rem;
  background-color: var(--bg-color);
}

h1 {
  font-size: 1.5rem;
  margin: 2rem 0;
}

.tableBody {
  width: 100%;
}

.tableRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tableHead {
  width: 25%;
  height: 100%;
  padding: 0.5rem;
  border: 1px solid #1f2937;
}

.tableData {
  width: 75%;
  padding: 0.5rem 1rem;
  color: #1f2937;
  background-color: #e0e0e0;
  border: 1px solid #1f2937;
}

@media (min-width: 648px) {
  .logo-container::after {
    top: 0;
    right: 0;
    bottom: 0;
    left: -15%;
    background-size: 55vw;
  }
}
</style>
