'use client'
import React, { forwardRef } from 'react'

const SettingsPanel = forwardRef<HTMLDivElement>((props, ref) => (
  <div className="settings" id="settings" ref={ref}>
            <button className="gear" id="btnSettings" title="Configurações" onClick={() => { document.getElementById('settings')?.classList.toggle('open') }}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 8.5a3.5 3.5 0 103.5 3.5A3.5 3.5 0 0012 8.5zm9 3a7.92 7.92 0 00-.13-1.44l2-1.55-2-3.46-2.35 1a7.86 7.86 0 00-2.5-1.45l-.36-2.49H10.3l-.36 2.49a7.86 7.86 0 00-2.5 1.45l-2.35-1-2 3.46 2 1.55A7.92 7.92 0 003 12.5a7.92 7.92 0 00.13 1.44l-2 1.55 2 3.46 2.35-1a7.86 7.86 0 002.5 1.45l.36 2.49h4.86l.36-2.49a7.86 7.86 0 002.5-1.45l2.35 1 2-3.46-2-1.55A7.92 7.92 0 0021 12.5z" /></svg>
            </button>
            <div className="panel" id="settingsPanel" aria-hidden="true">
              <div className="head">Configurações</div>
              <div className="body">
                <div className="cfg-section">
                  <details open>
                    <summary>Editar perfil</summary>
                    <div className="cfg-grid"><label>Nome do médico(a)<input id="profileName" placeholder="Ex.: Dr. João Silva" /></label></div>
                    <div className="cfg-actions"><button className="btn small primary" id="saveProfile">Salvar</button></div>
                  </details>
                </div>
                <div className="cfg-section">
                  <details open>
                    <summary>Visual</summary>
                    <div className="cfg-grid"><label>Preset do tema
                      <select id="presetSelect" defaultValue="padrao"><option value="padrao">Padrão</option>
</select>
                    </label></div>
                    <div className="cfg-actions"><button className="btn small" id="applyPreset">Aplicar preset</button></div>
                  </details>
                </div>
              </div>
            </div>
          </div>
))

SettingsPanel.displayName = 'SettingsPanel'
export default SettingsPanel
