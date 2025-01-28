<template>
  <div></div>
</template>

<script>
import confetti from 'canvas-confetti'

export default {
  props: {
    // `size` propで紙吹雪のサイズを選択できるようにする
    size: {
      type: Number,
      default: 1 // デフォルトのサイズは1（小さい紙吹雪）
    }
  },
  mounted() {
    this.showConfetti();
  },
  methods: {
    showConfetti() {
      const spread = this.size === 2 ? 100 : 50;
      const scalar = this.size === 2 ? 2 : 1; // 2のときは大きな紙吹雪、それ以外はデフォルトサイズ
      // 左側からの紙吹雪
      confetti({
        particleCount: 50,
        angle: 60,
        spread: spread,
        origin: { x: 0, y: 1 },
        colors: ['#ffc802'],
        gravity: 0.5,
        ticks: 200,
        scalar: scalar,
        shapes: ['square']
      });

      // 右側からの紙吹雪
      confetti({
        particleCount: 50,
        angle: 120,
        spread: spread,
        origin: { x: 1, y: 1 },
        colors: ['#ffc802'],
        gravity: 0.5,   //落ちる速さ
        ticks: 200,     //残る時間
        scalar: scalar,      //大きさ
        shapes: ['square']
      });
    }
  }
}
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
