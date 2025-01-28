<template>
  <ul role="list" class="divide-y divide-gray-100 dark:divide-gray-800">
    <li v-for="skill in skills" :key="skill.id" class="relative hover:bg-gray-50 dark:hover:bg-gray-800">
      <NuxtLink :to="skill.href">
        <div class="flex justify-between">
          <div>
            <p class="font-semibold leading-6 h-12 line-clamp-2">
              {{ skill.target }}
            </p>
          </div>
          <div class="content-center">
            <UIcon name="i-heroicons-chevron-right" class="h-10 w-10 flex-none text-secondary-500" aria-hidden="true" />
            <span class="absolute inset-0" aria-hidden="true" />
          </div>
        </div>
      </NuxtLink>
    </li>
  </ul>
  <UButton label="すべての獲得スキル" variant="soft" icon="i-heroicons-arrow-right-20-solid" block 
    to="/home/honor_skill"
    :ui="{
      block: 'justify-end',
    }"
  />
  </template>
  
  <script setup lang="ts">
  
  // sample
  const skills = [
    {
      id: 1,
      content: 'に挑戦しました',
      target: '失敗しないビジネスメールの書き方',
      href: '#',
      date: 'Sep 20',
      datetime: '2020-09-20',
      icon: 'i-heroicons-face-frown',
      iconBackground: 'bg-gray-400',
    },
    {
      id: 2,
      content: 'を獲得しました',
      target: 'VBA初心者',
      href: '#',
      date: 'Sep 22',
      datetime: '2020-09-22',
      icon: 'i-ph-medal-military',
      iconBackground: 'bg-primary',
    },
    {
      id: 3,
      content: 'をクリアしました',
      target: 'Microsoft Excel VBAマクロの基本①',
      href: '#',
      date: 'Sep 28',
      datetime: '2020-09-28',
      icon: 'i-heroicons-check-badge',
      iconBackground: 'bg-green-500',
    },
    {
      id: 4,
      content: 'を獲得しました',
      target: 'はじめの一歩',
      href: '#',
      date: 'Sep 30',
      datetime: '2020-09-30',
      icon: 'i-ph-medal-military',
      iconBackground: 'bg-primary',
    },
    {
      id: 5,
      content: 'をクリアしました',
      target: 'Microsoft Excel 基本的な関数①',
      href: '#',
      date: 'Oct 4',
      datetime: '2020-10-04',
      icon: 'i-heroicons-check-badge',
      iconBackground: 'bg-green-500',
    },
  ]
  
  </script>