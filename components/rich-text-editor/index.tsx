import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { toastError, toastSuccess } from "@/lib/toast";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme, useApi } from "@/hooks";
import { UPLOAD_DIR } from "@/lib/constants";

export interface RichtextEditorProps {
  loading?: boolean;
  defaultValue: string;
  targetFolder?: string;
  onChange?: (value: string) => void;
}

const baseOptions = {
  language: "zh_CN",
  branding: false,
  promotion: false,
  height: 500,
  font_size_input_default_unit: "px",
  font_size_formats: "12px 14px 16px 18px 20px 24px 28px 32px 36px 48px",
  menubar: "file edit view insert format tools table help custom",
  menu: {
    insert: {
      title: "Insert",
      items:
        "image multiupload link media codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor | insertdatetime",
    },
  },
  plugins: [
    "advlist",
    "autolink",
    "link",
    "image",
    "multiupload",
    "media",
    "table",
    "charmap",
    "emoticons",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "codesample",
    "fullscreen",
    "preview",
    "pagebreak",
    "insertdatetime",
    "wordcount",
    "help",
  ],
  toolbar:
    "undo redo | " +
    "blocks fontfamily fontsize | " +
    "bold italic underline strikethrough | " +
    "backcolor forecolor |" +
    "alignleft aligncenter alignright alignjustify | " +
    "outdent indent lineheight | " +
    "link image multiupload media table | " +
    "charmap emoticons | " +
    "code fullscreen preview print | " +
    "pagebreak anchor codesample | " +
    "removeformat help",
  contextmenu: "link image table",
  quickbars_selection_toolbar:
    "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
  content_style: "body { padding: 24px; }",
  content_css: "/tinymce/preflight.css",
};

export default function RichtextEditor(props: RichtextEditorProps) {
  const {
    loading,
    defaultValue,
    targetFolder = `${UPLOAD_DIR}/tinymce`,
    onChange,
  } = props;
  const editorRef = useRef<any>(null);
  const theme = useTheme();
  const [showEditor, setShowEditor] = useState(true);
  const { post } = useApi();

  const handleMultiUpload = useCallback(
    async (files: File[]) => {
      toast.loading("图片上传中...");
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("folder", targetFolder);

      try {
        const res = await post("/uploads", formData, {
          "Content-Type": "multipart/form-data",
        });

        const resFiles = res.files.map((file: any) => {
          return {
            ...file,
            url: file.url,
          };
        });

        toastSuccess("图片上传成功");
        return Promise.resolve(resFiles);
      } catch (err) {
        toastError("图片上传失败");
        return Promise.reject("Upload Failed.");
      }
    },
    [post, targetFolder]
  );

  const handleSingeUpload = useCallback(
    async (blobInfo: any) => {
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      formData.append("folder", targetFolder);

      try {
        const res = await post("/uploads", formData, {
          "Content-Type": "multipart/form-data",
        });

        return Promise.resolve(res.files[0].url);
      } catch (err) {
        return Promise.reject("Upload Failed.");
      }
    },
    [post, targetFolder]
  );

  const initOptions = useMemo(() => {
    return {
      ...baseOptions,
      images_upload_handler: handleSingeUpload,
      multiupload_handler: handleMultiUpload,
    };
  }, [handleSingeUpload, handleMultiUpload]);

  useEffect(() => {
    if (editorRef.current) {
      setShowEditor(false);
      setTimeout(() => {
        setShowEditor(true);
      }, 0);
    }
  }, [theme]);

  return (
    <>
      {showEditor && (
        <Editor
          disabled={loading}
          tinymceScriptSrc={
            process.env.NEXT_PUBLIC_BASE_URL + "/tinymce/tinymce.min.js"
          }
          init={{
            ...initOptions,
            skin: theme === "dark" ? "oxide-dark" : "oxide",
          }}
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={defaultValue}
          onEditorChange={(value) => onChange?.(value)}
        />
      )}
    </>
  );
}
