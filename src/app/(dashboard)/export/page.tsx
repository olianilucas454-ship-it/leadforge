'use client';

import React, { useState } from 'react';
import { FileText, Table, Code, Check } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { exportToCSV } from '@/lib/export/csv';
import { exportToExcel } from '@/lib/export/excel';
import { exportToJSON } from '@/lib/export/json';

export default function ExportPage() {
  const { allLeads } = useLeads();
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [filterClass, setFilterClass] = useState('Todos');
  
  const defaultFields = [
    { id: 'name', label: 'Empresa', checked: true },
    { id: 'category', label: 'Categoria', checked: true },
    { id: 'city', label: 'Cidade', checked: true },
    { id: 'address', label: 'Endereço', checked: true },
    { id: 'phone', label: 'Telefone', checked: true },
    { id: 'whatsapp', label: 'WhatsApp', checked: true },
    { id: 'website', label: 'Website', checked: true },
    { id: 'instagram', label: 'Instagram', checked: true },
    { id: 'rating', label: 'Avaliação', checked: true },
    { id: 'reviewCount', label: 'Nº Avaliações', checked: true },
    { id: 'websiteOpportunityScore', label: 'Score', checked: true },
    { id: 'classification', label: 'Classificação', checked: true },
    { id: 'crmStage', label: 'Status CRM', checked: true },
    { id: 'discoveredAt', label: 'Data', checked: true }
  ];

  const [fields, setFields] = useState(defaultFields);

  const toggleField = (id: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, checked: !f.checked } : f));
  };

  const handleExport = () => {
    // Filter leads
    let dataToExport = allLeads;
    if (filterClass !== 'Todos') {
      dataToExport = allLeads.filter(l => l.classification?.toLowerCase() === filterClass.toLowerCase());
    }

    // Map fields
    const selectedFields = fields.filter(f => f.checked);
    const formattedData = dataToExport.map(lead => {
      const row: Record<string, any> = {};
      selectedFields.forEach(f => {
        row[f.label] = (lead as any)[f.id] ?? '';
      });
      return row;
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `leadforge_export_${timestamp}`;

    if (selectedFormat === 'csv') {
      exportToCSV(formattedData, filename);
    } else if (selectedFormat === 'excel') {
      const columns = selectedFields.map(f => ({
        header: f.label,
        key: f.label,
        width: 20
      }));
      exportToExcel(formattedData, columns, filename);
    } else if (selectedFormat === 'json') {
      exportToJSON(formattedData, filename);
    }
  };

  const previewData = allLeads.slice(0, 5);
  const activeFields = fields.filter(f => f.checked);

  return (
    <div className="p-6 md:p-8 min-h-screen bg-background text-text-primary">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-text-primary">Exportar Leads</h1>
        <p className="text-text-secondary text-sm">Exporte seus leads encontrados e analisados em múltiplos formatos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          onClick={() => setSelectedFormat('csv')}
          className={`bg-surface border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedFormat === 'csv' ? 'border-accent shadow-lg shadow-accent/10' : 'border-border hover:border-border-hover'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${selectedFormat === 'csv' ? 'bg-accent/20 text-accent' : 'bg-surface-hover text-text-secondary'}`}>
              <FileText size={24} />
            </div>
            {selectedFormat === 'csv' && <Check size={20} className="text-accent" />}
          </div>
          <h3 className="text-xl font-bold mb-2 text-text-primary">CSV</h3>
          <p className="text-sm text-text-secondary">Compatível com Excel e Google Sheets</p>
        </div>

        <div 
          onClick={() => setSelectedFormat('excel')}
          className={`bg-surface border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedFormat === 'excel' ? 'border-accent shadow-lg shadow-accent/10' : 'border-border hover:border-border-hover'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${selectedFormat === 'excel' ? 'bg-accent/20 text-accent' : 'bg-surface-hover text-text-secondary'}`}>
              <Table size={24} />
            </div>
            {selectedFormat === 'excel' && <Check size={20} className="text-accent" />}
          </div>
          <h3 className="text-xl font-bold mb-2 text-text-primary">Excel (.xlsx)</h3>
          <p className="text-sm text-text-secondary">Planilha formatada com cabeçalhos e estilos</p>
        </div>

        <div 
          onClick={() => setSelectedFormat('json')}
          className={`bg-surface border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedFormat === 'json' ? 'border-accent shadow-lg shadow-accent/10' : 'border-border hover:border-border-hover'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${selectedFormat === 'json' ? 'bg-accent/20 text-accent' : 'bg-surface-hover text-text-secondary'}`}>
              <Code size={24} />
            </div>
            {selectedFormat === 'json' && <Check size={20} className="text-accent" />}
          </div>
          <h3 className="text-xl font-bold mb-2 text-text-primary">JSON</h3>
          <p className="text-sm text-text-secondary">Para integrações, webhooks e automações</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-1 text-text-primary">Configurações de Exportação</h2>
            <p className="text-sm text-text-secondary">Personalize os dados que deseja exportar</p>
          </div>
          <select 
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-surface-hover border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="Todos">Todos os Leads ({allLeads.length})</option>
            <option value="Hot">Apenas Hot Leads</option>
            <option value="Warm">Apenas Warm Leads</option>
            <option value="Cold">Apenas Cold Leads</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {fields.map(field => (
            <label key={field.id} className="flex items-center space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={field.checked}
                onChange={() => toggleField(field.id)}
                className="form-checkbox h-5 w-5 text-accent rounded border-border bg-surface-hover focus:ring-accent"
              />
              <span className="text-sm text-text-secondary">{field.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-8">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-text-primary">Prévia dos Dados (Primeiras 5 linhas)</h3>
          <span className="text-xs text-text-secondary">{allLeads.length} leads prontos para exportar</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-hover border-b border-border text-text-secondary">
              <tr>
                {activeFields.map(f => (
                  <th key={f.id} className="p-3">{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {previewData.length > 0 ? (
                previewData.map((lead, idx) => (
                  <tr key={lead.id || idx} className="hover:bg-surface-hover/50">
                    {activeFields.map(f => (
                      <td key={f.id} className="p-3 truncate max-w-xs text-text-primary">
                        {String((lead as any)[f.id] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeFields.length} className="p-6 text-center text-text-secondary">
                    Nenhum dado carregado para exportar. Faça uma busca primeiro!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleExport}
          disabled={allLeads.length === 0}
          className="bg-accent hover:bg-accent-hover text-black font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Exportar Arquivo {selectedFormat.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
