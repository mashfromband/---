<template>
  <ClientOnly>
    <UModal v-model="commonAlertState.isOpen">
      <UCard>
        <UAlert
          :icon=commonAlertState.icon
          :color=commonAlertState.background
          :description= commonAlertState.message
          variant="soft"
          :ui="{
            description: `${commonAlertState.descriptionDynamicClass}`,
          }"
        />
        <template #footer>
          <div class="flex items-center justify-center">
            <UButton v-on:click="closeAlertModal">CLOSE</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </ClientOnly>
</template>

<script setup lang="ts">
const commonAlertState = useCommonAlertState();
const closeAlertModal = async () => {
  commonAlertState.value.isOpen = false;
  if (commonAlertState.value.afterRedirectUrl) {
    await navigateTo(commonAlertState.value.afterRedirectUrl);
  }
}
</script>
