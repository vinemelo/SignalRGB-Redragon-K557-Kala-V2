# ⌨️ Redragon K557 Kala - SignalRGB Plugin

[🇧🇷 Português abaixo / Portuguese below]

This repository contains a high-performance JavaScript plugin developed to integrate the **Redragon K557 Kala** mechanical keyboard with **SignalRGB** software.

It addresses common issues found in generic drivers, such as incorrect mapping, LED ghosting, and misplaced Numpad keys.

## 🚀 Features

* **Precise 1:1 Mapping:** All keys, including the Numpad and media keys, are mapped to their correct physical positions.
* **Matrix Correction:** Solves the Redragon controller's "8-byte jump" logic, ensuring wave/visor effects flow perfectly from left to right without skipping keys.
* **High Performance (60 FPS):** Optimized code with coordinate pre-calculation and efficient memory management (Zero-Allocation Loop). Near-zero CPU usage during rendering.
* **Visual Layout:** Includes support for displaying the keyboard image within SignalRGB devices tab.
* **Hybrid Modes:** Supports "Canvas" mode (screen capture effects) and "Forced" mode (static single color).

## 📦 Installation

1.  Download the `Redragon_K557_Kala.js` file from this repository.
2.  Navigate to your SignalRGB plugins folder in Documents:
    * `C:\Users\YOUR_USER\Documents\WhirlwindFX\Plugins`
3.  Paste the `.js` file into this folder.
4.  Restart SignalRGB or go to **Devices** and reload plugins.
5.  The keyboard should appear automatically in the **Devices** tab as "Redragon K557 Kala (Pro Optimized)".

## 🔧 Technical Details

The K557 controller uses a specific protocol where LEDs are addressed in vertical columns with memory address jumps. This plugin implements:

* **Matrix Reverse Engineering:** Translates logical IDs (0-126) to Cartesian coordinates (X, Y) on the SignalRGB Canvas.
* **USB Protocol:** Handles 64-byte packets with real-time checksum calculation.
* **Optimized Buffer:** Uses static arrays to prevent constant JavaScript Garbage Collector triggering, ensuring smooth animations.

## 🤝 Contribution

Feel free to open **Issues** if you encounter bugs or want to suggest improvements. The goal is to keep this plugin as lightweight and compatible as possible.

---

# 🇧🇷 Versão em Português

Este repositório contém um plugin (addon) desenvolvido em JavaScript para integrar o teclado mecânico **Redragon K557 Kala** ao software **SignalRGB**.

Este plugin foi criado para solucionar problemas comuns de mapeamento, "ghosting" de LEDs e layout incorreto do Numpad que ocorrem com drivers genéricos.

## 🚀 Funcionalidades

* **Mapeamento 1:1 Preciso:** Todas as teclas, incluindo o Numpad e teclas de mídia, estão mapeadas em suas posições físicas corretas.
* **Correção de Matriz:** Resolve a lógica de "saltos de 8 bytes" do controlador da Redragon, garantindo que efeitos de onda (Wave/Visor) fluam perfeitamente da esquerda para a direita.
* **Alta Performance (60 FPS):** Código otimizado com pré-cálculo de coordenadas e gerenciamento de memória eficiente. Uso de CPU reduzido a quase zero durante a renderização.
* **Layout Visual:** Inclui suporte para exibição da imagem do teclado dentro do SignalRGB.
* **Modos Híbridos:** Suporte para modo "Canvas" (efeitos da tela) e modo "Forçado" (cor única estática).

## 📦 Instalação

1.  Baixe o arquivo `Redragon_K557_Kala.js` deste repositório.
2.  Navegue até a pasta de plugins do SignalRGB em seus Documentos:
    * `C:\Users\SEU_USUARIO\Documents\WhirlwindFX\Plugins`
3.  Cole o arquivo `.js` dentro desta pasta.
4.  Reinicie o SignalRGB ou vá em **Devices** e recarregue os plugins.
5.  O teclado deve aparecer automaticamente na aba **Devices** como "Redragon K557 Kala (Pro Optimized)".

## 🔧 Detalhes Técnicos

O controlador do K557 utiliza um protocolo onde os LEDs são endereçados em colunas verticais com saltos de memória. O plugin implementa:

* **Reverse Engineering da Matriz:** Tradução dos IDs lógicos (0-126) para coordenadas cartesianas (X, Y) no Canvas do SignalRGB.
* **Protocolo USB:** Envio de pacotes de 64 bytes com checksum calculado em tempo real.
* **Buffer Otimizado:** Utilização de arrays estáticos para evitar o acionamento constante do Garbage Collector do JavaScript.

## 🤝 Contribuição

Sinta-se à vontade para abrir **Issues** se encontrar algum bug ou sugerir melhorias no código. O objetivo é manter este plugin o mais leve e compatível possível.

---
*Developed by / Desenvolvido por: vinemelo
