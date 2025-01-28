<template>
  <Parent>
    <Child>
      <slot />
    </Child>
  </Parent>
</template>


<script>
import Parent from '~/layouts/default.vue'
import Child from '~/layouts/adminNavi.vue'

export default {
  components: {
    Parent,
    Child
  }
}
</script>
