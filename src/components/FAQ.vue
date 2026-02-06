<template>
  <div class="container mt-5">
    <h2 class="mb-4">Dúvidas Frequentes</h2>
    <div class="accordion" id="faqExample">
      <div v-for="(item, index) in faqs" :key="index" class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button"
            :class="{ collapsed: activeIndex !== index }"
            type="button"
            @click="toggleFAQ(index)"
          >
            <strong> {{ item.question }}</strong>
          </button>
        </h2>

        <div class="accordion-collapse collapse" :class="{ show: activeIndex === index }">
          <div class="accordion-body">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// State to keep track of which FAQ is open
const activeIndex = ref(null)

const faqs = ref([
  {
    question: 'Qual a base de cálculo previdenciária?',
    answer: 'A previdência incide sobre: Vencimento básico + GAJ + AQE.',
  },
  {
    question: 'Qual a base de cálculo do IRRF?',
    answer:
      'O imposto de renda retido na fonte (IRRF) incide sobre: [(Vencimento básico + GAJ + AQE + AQFC + Adic. Férias + Função) - Dedução da Previdência]. As alíquotas efetivas também são afetadas conforme o número de dependentes declarados.',
  },
  {
    question: 'O que é a previdência complementar?',
    answer:
      'Os novos servidores contribuem para o IGEPREV apenas até o teto (14% de R$ 8.475,55). O valor da base de cálculo previdenciária que ultrapassa este teto não sofre retenção, entretanto o servidor ficará limitado ao teto do IGEPREV para fins de aposentadoria. Quem optar pela previdência complementar pelo BrasilPrev, terá um desconto de 8,5% (ou maior, caso desejado) aplicado apenas sobre a faixa salarial que fica acima do teto do IGEPREV e limitada ao valor da sua base de cálculo previdenciária (Vencimento básico + GAJ + AQE). A previdência complementar também tem contribuição patronal de 8,5%.',
  },
  {
    question: 'Como funcionam os tetos do auxílio saúde?',
    answer:
      'Existem limites de reembolso por faixa etária de cada beneficiário, bem como um limite global. Como os planos de saúde são reajustados anualmente, o simulador já demonstra como estão os percentuais de uso desses limites.',
  },
])

// The function that was giving you the "not defined" error
// Now safely scoped inside the component!
const toggleFAQ = (index) => {
  if (activeIndex.value === index) {
    activeIndex.value = null // Close if already open
  } else {
    activeIndex.value = index // Open the clicked one
  }
}
</script>

<style scoped>
/* Optional: Add a smooth transition if not using Bootstrap's JS */
.accordion-collapse {
  transition: all 0.3s ease-in-out;
}
</style>
