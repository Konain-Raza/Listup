import React from "react";
import TemplateForm from "../components/TemplateForm";
import { toast } from "react-toastify";

const FormPage = ({ owner, templates, setTemplates, editTemplate }) => {
  return (
    <div>
      <TemplateForm
        owner={owner}
        templates={templates}
        setTemplates={setTemplates}
        template={editTemplate}
        isEditMode={!!editTemplate}
      />
    </div>
  );
};

export default FormPage;
