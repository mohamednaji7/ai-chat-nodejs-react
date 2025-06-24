import { getProjectFile } from '../../utils/api';
import ReactMarkdown from 'react-markdown';
import { useFileExplorerContext } from '../../contexts/FileExplorerContext';


interface ProjectFile {
  _id: string;
  name: string;
  content: string;
  content_format: string;
  tokens: number | null;
  created_at: string;
}

export const fileMentionRegex = /<file-mention id=['"](.+?)['"] name=['"](.+?)['"]\s*\/>/g

export const useFileMentionProcessor = () => {
  const { setSelectedFileId, setIsFileExplorerOpen } = useFileExplorerContext();

  const preprocessContent = (rawContent: string): string => {
    const fileContentBlockRegex = /```html\s*(<file-mention[^>]+\/>)\s*```/g;
    return rawContent.replace(fileContentBlockRegex, '$1');
  };

  const fetchFileForMention = async (fileId: string): Promise<ProjectFile> => {
    try {
      const file = await getProjectFile(fileId);
      return file;
    } catch (error) {
      console.error('Error fetching file for mention:', error);
      throw error;
    }
  };

  const renderMessageContent = (rawContent: string) => {
    const content = preprocessContent(rawContent);
    const parts = [];
    
    let lastIndex = 0;
    let match;
    
    while ((match = fileMentionRegex.exec(content)) !== null) {
      const fileId = match[1];
      const fileName = match[2];

      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push(
          <ReactMarkdown key={`text-${match.index}`}>
            {textBefore}
          </ReactMarkdown>
        );
      }
      
      parts.push(
        <span 
          key={`file-${fileId}`}
          className="artifact-button"
          onClick={() => {
            console.log('Opening file:', fileId, fileName);
            setIsFileExplorerOpen(true);
            setSelectedFileId(fileId);
          }}
        >
          📎 {fileName}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      parts.push(
        <ReactMarkdown key={`text-end`}>
          {content.substring(lastIndex)}
        </ReactMarkdown>
      );
    }
    
    return parts;
  };

  return {
    renderMessageContent,
    preprocessContent,
    fetchFileForMention
  };
};