<template>
  <div class="container mt-5">
    <div class="mb-5">
      <h2 class="">Atualizações</h2>
      <p class="text-muted">Acompanhe as últimas atualizações e melhorias.</p>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Version 2.0.0 -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <span class="badge bg-light version-badge me-2">16/01/2026</span>
              <small class="text-muted"> </small>
            </div>

            <h5 class="card-title"></h5>

            <div class="position-relative">
              <div class="changelog-item mb-3">
                <div class="timeline-line"></div>
                <h6 class="fw-bold text-success">Novos recursos</h6>
                <p>🚨 Nova opção para simular data-base 2026, com percentual ajustável.</p>
              </div>

<!--               <div class="changelog-item mb-3">
                <div class="timeline-line"></div>
                <h6 class="fw-bold text-danger">Correções</h6>

              </div> -->

              <div class="changelog-item">
                <h6 class="fw-bold text-warning">Alterações</h6>
                <p>
                  🛒 A calculadora já está considerando reajuste de +15% no aux. alimentação (uma
                  diferença de R$ 318,30).
                                  <p>
                  🆕 A calculadora foi atualizada considerando que o teto do IGEPREV aumentou de
                  R$8.157,40 para R$8.475,55 em 2026. Desta forma, os descontos do IGEPREV e
                  BrasilPrev mudaram.
                </p>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Version 1.9.0
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <span class="badge bg-secondary version-badge me-2">v1.9.0</span>
              <small class="text-muted">December 15, 2024</small>
            </div>

            <h5 class="card-title">Feature Update: Enhanced Security</h5>

            <div class="position-relative">
              <div class="changelog-item mb-3">
                <div class="timeline-line"></div>
                <h6 class="fw-bold text-success">Added</h6>
                <p>Two-factor authentication support</p>
                <p>Email notifications for security events</p>
              </div>

              <div class="changelog-item">
                <h6 class="fw-bold text-warning">Changed</h6>
                <p>Updated password requirements for better security</p>
                <p>Improved session management</p>
              </div>
            </div>
          </div>
        </div>


        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <span class="badge bg-secondary version-badge me-2">v1.8.5</span>
              <small class="text-muted">December 1, 2024</small>
            </div>

            <h5 class="card-title">Maintenance Update</h5>

            <div class="position-relative">
              <div class="changelog-item mb-3">
                <div class="timeline-line"></div>
                <h6 class="fw-bold text-danger">Fixed</h6>
                <p>Minor bug fixes and performance improvements</p>
                <p>Resolved issue with data export functionality</p>
              </div>

              <div class="changelog-item">
                <h6 class="fw-bold text-warning">Changed</h6>
                <p>Updated third-party dependencies</p>
                <p>Documentation improvements</p>
              </div>
            </div>
          </div>
        </div>
         -->
      </div>
    </div>
  </div>
</template>

<style>
.version-badge {
  font-size: 0.8rem;
  padding: 0.35em 0.65em;
}

.changelog-item {
  position: relative;
  padding-left: 20px;
}

.changelog-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #0d6efd;
}

.timeline-line {
  position: absolute;
  left: 3px;
  top: 20px;
  bottom: -8px;
  width: 2px;
  background-color: #dee2e6;
}
</style>
