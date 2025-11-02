"use client";

import React from 'react';

const AdminStyles: React.FC = () => (
  <style jsx global>{`
    :root {
      --primary: #2c3e50;
      --secondary: #3498db;
      --success: #27ae60;
      --warning: #f39c12;
      --danger: #e74c3c;
      --light: #ecf0f1;
      --dark: #34495e;
      --sidebar-width: 250px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background-color: #f5f7fa;
      color: #333;
    }

    .flex {
      display: flex;
    }

    .min-h-screen {
      min-height: 100vh;
    }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      background-color: var(--primary);
      color: white;
      height: 100vh;
      position: fixed;
      overflow-y: auto;
      transition: all 0.3s;
      z-index: 1000;
    }

    .logo {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo h1 {
      font-size: 1.5rem;
      margin-bottom: 5px;
    }

    .logo p {
      font-size: 0.8rem;
      opacity: 0.7;
    }

    .nav-menu {
      padding: 15px 0;
    }

    .nav-item {
      padding: 12px 20px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-item.active {
      background-color: var(--secondary);
    }

    .nav-item i {
      margin-right: 10px;
      width: 20px;
      text-align: center;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      padding: 20px;
      transition: all 0.3s;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ddd;
    }

    .header h2 {
      color: var(--primary);
    }

    .user-info {
      display: flex;
      align-items: center;
    }

    .user-info img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    /* Cards */
    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      transition: transform 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .card-title {
      font-size: 1rem;
      color: var(--dark);
    }

    .card-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .card-icon.users {
      background-color: var(--secondary);
    }

    .card-icon.prescriptions {
      background-color: var(--success);
    }

    .card-icon.menus {
      background-color: var(--warning);
    }

    .card-icon.financial {
      background-color: var(--danger);
    }

    .card-value {
      font-size: 1.8rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .card-description {
      font-size: 0.8rem;
      color: #777;
    }

    /* Content Sections */
    .content-section {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .section-title {
      color: var(--primary);
    }

    .btn {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: var(--secondary);
      color: white;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-success {
      background-color: var(--success);
      color: white;
    }

    .btn-success:hover {
      background-color: #219653;
    }

    .btn-danger {
      background-color: var(--danger);
      color: white;
    }

    .btn-danger:hover {
      background-color: #c0392b;
    }

    .btn-warning {
      background-color: var(--warning);
      color: white;
    }

    .btn-warning:hover {
      background-color: #e67e22;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f8f9fa;
      color: var(--dark);
      font-weight: 600;
    }

    tr:hover {
      background-color: #f8f9fa;
    }

    .actions {
      display: flex;
      gap: 5px;
    }

    .action-btn {
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .action-edit {
      background-color: var(--warning);
      color: white;
    }

    .action-delete {
      background-color: var(--danger);
      color: white;
    }

    .action-view {
      background-color: var(--secondary);
      color: white;
    }

    /* Forms */
    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }

    .form-row {
      display: flex;
      gap: 15px;
    }

    .form-row .form-group {
      flex: 1;
    }

    /* Tabs */
    .tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
    }

    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }

    .tab.active {
      border-bottom: 2px solid var(--secondary);
      color: var(--secondary);
      font-weight: 500;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    /* Status badges */
    .status {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status.active {
      background-color: #d4edda;
      color: #155724;
    }

    .status.inactive {
      background-color: #f8d7da;
      color: #721c24;
    }

    .status.pending {
      background-color: #fff3cd;
      color: #856404;
    }

    /* Modal */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .modal-title {
      color: var(--primary);
      margin: 0;
    }

    .close-modal {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #777;
    }

    /* Menu Tree */
    .menu-tree {
      margin-top: 20px;
    }

    .menu-item {
      margin-bottom: 10px;
      border: 1px solid #eee;
      border-radius: 4px;
      overflow: hidden;
    }

    .menu-header {
      background-color: #f8f9fa;
      padding: 12px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .menu-header:hover {
      background-color: #e9ecef;
    }

    .menu-title {
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .menu-title i {
      margin-right: 8px;
    }

    .menu-actions {
      display: flex;
      gap: 5px;
    }

    .submenu-list {
      background-color: white;
      padding: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .submenu-list.active {
      max-height: 500px;
      /* Valor alto para simular altura automática */
    }

    .submenu-item {
      padding: 10px 15px 10px 40px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .submenu-item:last-child {
      border-bottom: none;
    }

    .submenu-item:hover {
      background-color: #f8f9fa;
    }

    .empty-message {
      padding: 15px;
      text-align: center;
      color: #777;
      font-style: italic;
    }

    /* Prescription Editor */
    .prescription-editor {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
    }

    .editor-toolbar {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    .editor-content {
      min-height: 200px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
    }

    .medication-item {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      align-items: center;
    }

    .medication-item input {
      flex: 1;
    }

    .add-medication {
      margin-top: 10px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        width: 70px;
      }

      .sidebar .logo h1,
      .sidebar .logo p,
      .sidebar .nav-item span {
        display: none;
      }

      .sidebar .nav-item i {
        margin-right: 0;
        font-size: 1.2rem;
      }

      .main-content {
        margin-left: 70px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `}</style>
);

export default AdminStyles;
