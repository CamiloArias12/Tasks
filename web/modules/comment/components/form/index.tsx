import { Textarea } from "@heroui/input";
import { Comment } from "../../types";

interface FormCommentProps {
  comment?: Comment;
  taskId: string;
  userId: string;
}

export function FormComment({ comment, taskId, userId }: FormCommentProps) {
  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="taskId" value={taskId} />
      <input type="hidden" name="userId" value={userId} />
      
      <Textarea
        name="description"
        label="Comentario"
        placeholder="Escribe tu comentario..."
        defaultValue={comment?.description}
        required
        rows={4}
      />
    </div>
  );
}