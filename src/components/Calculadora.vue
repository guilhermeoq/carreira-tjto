<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary navbar-collapse">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">🚀 Simulador TJTO</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://sapl.al.to.leg.br/media/sapl/public/normajuridica/2024/923/lei_4435-2024.pdf"
              >Data-base</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://www.tjto.jus.br/component/edocman/685-plano-de-cargos-carreiras-e-remuneracao-dos-servidores-do-tjto/viewdocument/685?Itemid="
              >PCCR</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://sapl.al.to.leg.br/materia/9605">URV PL06/2023</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://www.instagram.com/aprovadostjto">@aprovadostjto</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div id="app" class="container-lg">
    <div style="padding-top: 2em" class="container-sm">
      <h1 class="title">
        Simulador de Salário do <span style="color: rgb(109 40 217)">PCCR</span> dos Servidores do
        TJTO
      </h1>
      <p class="subtitle">
        Este simulador é <strong>gratuito</strong>, não coleta nenhuma informação pessoal e foi
        desenvolvido com base em dados do Portal da Transparência e da legislação vigente.
      </p>
    </div>
    <div class="calculators">
      <div v-for="(calculator, index) in calculators" :key="index" class="calculator">
        <h4>Simulação {{ index + 1 }}</h4>
        <form @change="updateSalary(index)">
          <div class="form-check form-switch mb-3">
            <input
              v-model="calculator.simularAumento"
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="URVSwitch"
            />
            <label class="form-check-label" for="URVSwitch"
              >Simular URV de 11,98% (PL 06/2023)</label
            >
          </div>
          <!--<div>
            <label>
              <input type="checkbox" v-model="calculator.simularAumento" /> Simular URV de 11,98%
              (PL 06/2023)
            </label>
          </div>-->

          <!--<label for="cargo">Cargo:</label>-->
          <div class="form-floating mb-3">
            <select
              class="form-select"
              id="cargoSelect"
              aria-label="Selecione o cargo"
              v-model="calculator.cargo"
            >
              <option value="tecnico" selected>Técnico Judiciário</option>
              <option value="analista">Analista Judiciário</option>
            </select>
            <label for="cargoSelect">Cargo</label>
          </div>
          <!--
            <select style="margin-left: 1em" id="cargo" v-model="calculator.cargo">
              <option value="tecnico">Técnico</option>
              <option value="analista">Analista</option>
            </select>-->

          <!--<label for="nivel">Nível:</label>-->
          <div class="form-floating mb-3">
            <select
              class="form-select"
              id="nivel"
              aria-label="Selecione o nível"
              v-model.number="calculator.nivel"
            >
              <option v-for="n in 15" :value="n">{{ n }}</option>
            </select>
            <label for="nivel">Nível</label>
          </div>
          <!--<select style="margin-left: 1em" id="nivel" v-model.number="calculator.nivel">
              <option v-for="n in 15" :value="n">{{ n }}</option>
            </select>-->

          <!--<label for="aqfc">AQFC:</label>-->
          <div class="form-floating mb-3">
            <select
              class="form-select"
              id="aqfc"
              aria-label="Selecione o percentual AQFC"
              v-model.number="calculator.aqfc"
            >
              <option v-for="percent in [0, 1, 2, 3]" :value="percent">{{ percent }}%</option>
            </select>
            <label for="aqfc">Percentual AQFC</label>
          </div>
          <!--<select style="margin-left: 1em" id="aqfc" v-model.number="calculator.aqfc">
              <option v-for="percent in [0, 1, 2, 3]" :value="percent">{{ percent }}%</option>
            </select>-->
          <!--<label for="aqe">AQE:</label>-->
          <div class="form-floating">
            <select
              class="form-select"
              id="aqe"
              aria-label="Selecione o percentual AQE"
              v-model.number="calculator.aqe"
            >
              <!-- Use the computed property `filteredAQE` to filter options -->
              <option
                v-for="percent in getAqeOptions(calculator.cargo)"
                :key="percent"
                :value="percent"
              >
                {{ percent }}%
              </option>
            </select>
            <label for="aqe">Percentual AQE</label>
          </div>
          <!--<select style="margin-left: 1em" id="aqe" v-model.number="calculator.aqe">
              <option v-for="percent in [0, 5, 7.5, 10.5, 12.5]" :value="percent">
                {{ percent }}%
              </option>
            </select>-->
        </form>
        <div>
          <h5 style="margin-top: 10px">Rendimentos</h5>
          <p class="prend">
            <strong>Vencimento Básico:</strong> {{ formatarParaBR(calculator.vencimentoBasico) }}
          </p>
          <p class="prend"><strong>GAJ (30%):</strong> {{ formatarParaBR(calculator.gaj) }}</p>
          <p class="prend"><strong>AQE:</strong> {{ formatarParaBR(calculator.aqeValue) }}</p>
          <p class="prend"><strong>AQFC:</strong> {{ formatarParaBR(calculator.aqfcValue) }}</p>
          <p class="paux"><strong>Auxílio Alimentação:</strong> R$ 2.122,00</p>
          <p class="pbruto">Salário Bruto: {{ formatarParaBR(calculator.salarioBruto) }}</p>
        </div>
        <div>
          <h5 style="margin-top: 10px">Descontos</h5>
          <p class="pdesc">Previdência: {{ formatarParaBR(calculator.previdencia) }}</p>
          <p class="pdesc">IRRF: {{ formatarParaBR(calculator.irrf) }}</p>
          <p class="pdesctotal">
            Total de Descontos: {{ formatarParaBR(calculator.totalDescontos) }}
          </p>
        </div>
        <p class="pliquido">Salário Líquido: {{ formatarParaBR(calculator.salarioLiquido) }}</p>
      </div>
    </div>
    <h5 style="text-align: center; margin-top: 1em; margin-bottom: 1em">
      Comparativo (diferença de valor líquido): {{ formatarParaBR(salaryDifference) }}
    </h5>
    <div class="container d-flex justify-content-center align-items-center">
      <p>
        Desenvolvido por
        <a class="dark:text-muted text-blue-600 underline" href="https://beacons.ai/guilhermeoq"
          >Guilherme Quintino</a
        >
        /
        <a
          class="dark:text-muted text-blue-600 underline"
          href="https://instagram.com/aprovadostjto"
          >@aprovadostjto</a
        >. Os valores calculados nesta página não podem ser considerados 100% corretos devido a
        possíveis erros nos cálculos e nos valores e alíquotas de impostos e gratificações. Não nos
        responsabilizamos por eventuais diferenças entre a simulação e os valores reais.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      calculators: [this.createCalculator(), this.createCalculator()],
    }
  },
  computed: {
    salaryDifference() {
      return Math.abs(this.calculators[0].salarioLiquido - this.calculators[1].salarioLiquido)
    },
  },
  methods: {
    createCalculator() {
      return {
        simularAumento: false,
        cargo: 'tecnico',
        nivel: 1,
        aqfc: 3,
        aqe: 7.5,
        vencimentoBasico: 0,
        gaj: 0,
        aqfcValue: 0,
        aqeValue: 0,
        salarioBruto: 0,
        previdencia: 0,
        irrf: 0,
        totalDescontos: 0,
        salarioLiquido: 0,
      }
    },
    getAqeOptions(cargo) {
      if (cargo === 'analista') {
        return [0, 7.5, 10.5, 12.5]
      }
      return [0, 5, 7.5, 10.5, 12.5]
    },
    updateSalary(index) {
      const calculator = this.calculators[index]
      const salarios = {
        tecnico: [
          7140.42, 7497.44, 7872.31, 8265.92, 8679.22, 9113.17, 9568.85, 10047.27, 10549.66,
          11077.11, 11630.98, 12212.54, 12823.16, 13464.32, 14137.55,
        ],
        analista: [
          11954.45, 12552.18, 13179.8, 13838.77, 14530.7, 15257.24, 16020.1, 16821.11, 17662.11,
          18545.29, 19472.54, 20446.16, 21468.48, 22541.9, 23669.0,
        ],
      }

      const vb = salarios[calculator.cargo][calculator.nivel - 1]
      calculator.vencimentoBasico = calculator.simularAumento ? vb * 1.1198 : vb
      calculator.gaj = calculator.vencimentoBasico * 0.3
      calculator.aqfcValue = calculator.vencimentoBasico * (calculator.aqfc / 100)
      calculator.aqeValue = calculator.vencimentoBasico * (calculator.aqe / 100)
      calculator.salarioBruto =
        calculator.vencimentoBasico +
        calculator.gaj +
        calculator.aqfcValue +
        calculator.aqeValue +
        2122
      calculator.previdencia =
        (calculator.vencimentoBasico + calculator.gaj + calculator.aqeValue) * 0.14

      const baseIRRF =
        calculator.vencimentoBasico +
        calculator.gaj +
        calculator.aqeValue +
        calculator.aqfcValue -
        calculator.previdencia
      calculator.irrf = this.calcularIrrf(baseIRRF)
      calculator.totalDescontos = calculator.previdencia + calculator.irrf
      calculator.salarioLiquido = calculator.salarioBruto - calculator.totalDescontos
    },
    calcularIrrf(baseCalculo) {
      if (baseCalculo <= 2259.2) {
        return 0
      } else if (baseCalculo <= 2826.65) {
        return (baseCalculo - 2259.2) * 0.075
      } else if (baseCalculo <= 3751.05) {
        return (baseCalculo - 2826.65) * 0.15 + 567.45 * 0.075
      } else if (baseCalculo <= 4664.68) {
        return (baseCalculo - 3751.05) * 0.225 + 924.4 * 0.15 + 567.45 * 0.075
      } else {
        return (baseCalculo - 4664.68) * 0.275 + 913.63 * 0.225 + 924.4 * 0.15 + 567.45 * 0.075
      }
    },
    formatarParaBR(valor) {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2, // Ensure at least 2 decimal places
        maximumFractionDigits: 2, // Limit to 2 decimal places
      })
    },
  },
  watch: {
    calculators: {
      deep: true,
      handler(newCalculators) {
        newCalculators.forEach((calculator) => {
          const validOptions = this.getAqeOptions(calculator.cargo)
          if (!validOptions.includes(calculator.aqe)) {
            calculator.aqe = 0 // Reset AQE to a default valid value
          }
        })
      },
    },
  },

  mounted() {
    this.calculators.forEach((_, index) => this.updateSalary(index))
  },
}
</script>

<style scoped>
.calculator {
  flex: 1;
  padding: 3em;
  margin: 10px;
  border-radius: 1.5em;
  background-color: white;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: 100%;
}

@media (min-width: 600px) {
  .calculator {
    width: calc(50% - 20px);
  }
}
.result {
  font-weight: bold;
  margin-top: 10px;
}

p {
  margin-top: 0;
  margin-bottom: 0em;
}

.prend {
  background-color: lightblue;
  margin-bottom: 1px;
  padding: 5px;
}
.paux {
  background-color: #74bad1;
  padding: 5px;
}

.pbruto {
  background-color: #454545;
  padding: 5px;
  color: white;
}

.pdesc {
  background-color: #fba1a1;
  padding: 5px;
  margin-bottom: 1px;
}

.pdesctotal {
  background-color: #fd5b5b;
  padding: 5px;
  font-weight: bold;
}

.pliquido {
  margin-top: 1em;
  background-color: lightgreen;
  padding: 5px;
  font-weight: bold;
}

.calculators {
  display: flex;
  gap: 20px; /* Adjust the gap between the divs */
  flex-wrap: wrap; /* Ensures the divs wrap on smaller screens */
}

.title {
  font-weight: 700; /* Equivalent to font-bold */
  font-family: 'YourHeadingFont', sans-serif; /* Equivalent to font-heading, replace 'YourHeadingFont' with the actual font you're using */
  line-height: 1.25; /* Equivalent to leading-tighter, adjust value as needed */
  margin-bottom: 1rem; /* Equivalent to mb-4 */
  letter-spacing: -0.05em; /* Equivalent to tracking-tighter, adjust value as needed */
  color: #1f1f1f; /* Equivalent to dark:text-gray-200, adjust color if necessary */
  font-size: 3rem; /* Equivalent to text-5xl */
}

@media (min-width: 768px) {
  .title-class {
    font-size: 4rem; /* Equivalent to md:text-6xl */
  }
}

.subtitle {
  font-family: 'YourHeadingFont', sans-serif; /* Equivalent to font-heading, replace 'YourHeadingFont' with the actual font you're using */
  line-height: 1.25; /* Equivalent to leading-tighter, adjust value as needed */
  margin-bottom: 1rem; /* Equivalent to mb-4 */
  color: #1f1f1f; /* Equivalent to dark:text-gray-200, adjust color if necessary */
  font-size: 1.25rem; /* Equivalent to text-5xl */
}
</style>
