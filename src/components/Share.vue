<template>
  <button
    v-if="isShareSupported"
    @click="shareWebsite"
    type="button"
    class="btn btn-outline-secondary btn-lg px-4"
  >
    <i class="bi bi-share-fill me-2"></i>
    Compartilhar
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isShareSupported = ref(false)

onMounted(() => {
  // Verifica suporte à API de compartilhamento nativa
  isShareSupported.value = !!navigator.share
})

const shareWebsite = async () => {
  try {
    await navigator.share({
      title: 'Calculadora de Salários TJTO',
      text: 'Simule vencimentos, auxílios e descontos dos servidores do TJTO de forma simples!',
      url: window.location.href,
    })
  } catch (err) {
    // Caso o usuário cancele ou dê erro, não quebra a aplicação
    console.log('Compartilhamento cancelado ou não disponível.')
  }
}
</script>
