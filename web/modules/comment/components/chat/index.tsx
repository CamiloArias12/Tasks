import { Button } from "@/modules/common/components/button";
import { Textarea } from "@heroui/input";
import { Comment } from "../../types";
import { Task } from "@/modules/task/types";
import { UserRes } from "@/modules/dashboard/types";
import { useState, useActionState, startTransition, useEffect } from "react";
import { getCommentsByTaskAction, createCommentForm, updateCommentForm, deleteCommentForm } from "../../services/actions";
import { useFormResponse } from "@/modules/common/hooks/use-form-response";

interface CommentsChatProps {
  task: Task;
  currentUser?: UserRes;
  users?: UserRes[];
  onClose?: () => void;
}

export default function CommentsChat({ task, currentUser, onClose, users }: CommentsChatProps) {
  const [taskComments, setTaskComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const [commentsResponse, commentsDispatch] = useActionState(getCommentsByTaskAction, {
    messages: [],
    errors: [],
    data: null,
  });

  const [createResponse, createDispatch] = useActionState(createCommentForm, {
    messages: [],
    errors: [],
  });

  const [updateResponse, updateDispatch] = useActionState(updateCommentForm, {
    messages: [],
    errors: [],
  });

  const [deleteResponse, deleteDispatch] = useActionState(deleteCommentForm, {
    messages: [],
    errors: [],
  });

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    if (commentsResponse.data) {
      setIsLoading(false);
      if (commentsResponse.data) {
        setTaskComments(commentsResponse.data);
      }
    }
  }, [commentsResponse]);

  useFormResponse({
    response: createResponse,
    onEnd: () => {
      setIsSubmitting(false);
      setNewComment("");
      loadComments();
    },
  });

  useFormResponse({
    response: updateResponse,
    onEnd: () => {
      setEditingComment(null);
      setEditText("");
      loadComments();
    },
  });

  useFormResponse({
    response: deleteResponse,
    onEnd: () => {
      loadComments();
    },
  });

  const loadComments = () => {
    setIsLoading(true);
    startTransition(() => {
      const formData = new FormData();
      formData.set('taskId', task.id!);
      commentsDispatch(formData);
    });
  };

  const handleCreateComment = () => {
    if (!newComment.trim() || !currentUser || isSubmitting) return;
    
    setIsSubmitting(true);
    startTransition(() => {
      const formData = new FormData();
      formData.set('taskId', task.id!);
      formData.set('userId', currentUser.id);
      formData.set('description', newComment.trim());
      createDispatch(formData);
    });
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id!);
    setEditText(comment.description);
  };

  const getUserName = (userId: string) => {
    const user = users?.find(u => u.id === userId);
    return user ? user.name : 'Usuario';
  };

  const getUserInitials = (userId: string) => {
    const user = users?.find(u => u.id === userId);
    if (user) {
      return `${user.name.charAt(0).toUpperCase()}${user.name.split(' ')[1]?.charAt(0).toUpperCase() || ''}`;
    }
    return 'U';
  };

  const handleUpdateComment = (commentId: string) => {
    if (!editText.trim()) return;
    
    startTransition(() => {
      const formData = new FormData();
      formData.set('taskId', task.id!);
      formData.set('id', commentId);
      formData.set('description', editText.trim());
      updateDispatch(formData);
    });
  };

  const handleDeleteComment = (commentId: string) => {
      startTransition(() => {
        const formData = new FormData();
        formData.set('id', commentId);
        deleteDispatch(formData);
      });
    
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-white border rounded-lg shadow-2xl z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-12' : 'w-96 h-[500px]'
    } flex flex-col`}>
      <div className="border-b p-3 bg-gray-50 rounded-t-lg cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="text-lg">💬</span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {task.title}
              </h3>
              {!isMinimized && (
                <p className="text-xs text-gray-600 truncate">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button 
              size="sm" 
              variant="light" 
              color="primary"
              className="h-6 min-w-0 px-2 text-xs"
              onPress={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? '⬆️' : '⬇️'}
            </Button>
            <Button 
              size="sm" 
              variant="light" 
              color="danger"
              className="h-6 min-w-0 px-2 text-xs"
              onPress={onClose}
            >
              ✕
            </Button>
          </div>
        </div>
        {isMinimized && (
          <div className="text-xs text-gray-500 mt-1">
            {taskComments.length} comentario{taskComments.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Cargando...</p>
                </div>
              </div>
            ) : taskComments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="mb-2">💬</div>
                <p className="text-sm">No hay comentarios</p>
                <p className="text-xs">¡Sé el primero!</p>
              </div>
            ) : (
              taskComments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-xs">
                          {getUserInitials(comment.userId)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-sm text-gray-900 block truncate">
                          {getUserName(comment.userId)}
                        </span>
                        {comment.createdAt && (
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {currentUser?.id === comment.userId && (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button 
                          size="sm" 
                          variant="light" 
                          color="primary"
                          className="h-6 min-w-0 px-2 text-xs"
                          onPress={() => handleEditComment(comment)}
                        >
                          ✏️
                        </Button>
                        <Button 
                          size="sm" 
                          variant="light" 
                          color="danger"
                          className="h-6 min-w-0 px-2 text-xs"
                          onPress={() => handleDeleteComment(comment.id!)}
                        >
                          🗑️
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-8">
                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          placeholder="Edita tu comentario..."
                          rows={2}
                          size="sm"
                          onKeyDown={(e) => handleKeyPress(e, () => handleUpdateComment(comment.id!))}
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            color="primary"
                            onPress={() => handleUpdateComment(comment.id!)}
                            isDisabled={!editText.trim()}
                          >
                            Guardar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="light"
                            onPress={handleCancelEdit}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed break-words">
                        {comment.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input para nuevo comentario */}
          {currentUser && (
            <div className="border-t p-4 bg-gray-50 rounded-b-lg">
              <div className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  rows={2}
                  size="sm"
                  onKeyDown={(e) => handleKeyPress(e, handleCreateComment)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Ctrl+Enter
                  </span>
                  <Button 
                    color="primary" 
                    size="sm"
                    onPress={handleCreateComment}
                    isLoading={isSubmitting}
                    isDisabled={!newComment.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}