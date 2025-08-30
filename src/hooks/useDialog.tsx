import { LoadingButton, type LoadingButtonProps } from "@mui/lab";
import { Dialog, DialogActions, DialogContent, type DialogProps, DialogTitle, Divider, Slide } from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState, type JSX } from "react";

interface SharedProps {
  isOpen?: boolean;
  isLoading?: boolean;
  title?: string | JSX.Element;
  content?: string | JSX.Element;
  confirmBtnContent?: string | JSX.Element;
  confirmBtnProps?: LoadingButtonProps;
  showConfirmBtn?: boolean;
  cancelBtnContent?: string | JSX.Element;
  cancelBtnProps?: LoadingButtonProps;
  showCancelBtn?: boolean;
  dialogProps?: Omit<DialogProps, "open">;
  closeDialogOnConfirm?: boolean;
  closeDialogOnClickAway?: boolean;
  // events
  onOpen?: () => Promise<unknown> | unknown;
  onConfirm?: () => Promise<unknown> | unknown;
  onClose?: () => Promise<unknown> | unknown;
}

interface UseDialogConfigProps extends SharedProps {
  resetOnClose?: boolean;
}

export interface UseDialogConfig extends SharedProps {
  isOpen: boolean;
  isLoading: boolean;

  setSettings: (settings: UseDialogConfigProps) => void;

  // events
  reset: () => void;
  // end events
  closeDialogOnConfirm: boolean;
  closeDialogOnClickAway: boolean;
}

export const useDialogConfig = (props: UseDialogConfigProps = { isOpen: false, isLoading: false }): UseDialogConfig => {
  const { resetOnClose = true } = props;

  // useStates
  const [settings, _setSettings] = useState<UseDialogConfigProps>(props);

  // handle useStates
  const setSettings = (settings: UseDialogConfigProps) => _setSettings((x) => ({ ...x, ...settings }));

  useEffect(() => {
    if (resetOnClose && !settings.isOpen) {
      reset();
    }
  }, [settings.isOpen]);

  const reset = () => {
    _setSettings({
      title: props.title,
      isLoading: false,
      content: props.content,
      onOpen: props.onOpen,
      onConfirm: props.onConfirm,
      onClose: props.onClose,
    });
  };

  return {
    ...props,
    ...settings,
    isOpen: settings.isOpen || false,
    isLoading: settings.isLoading || false,

    // override
    reset,
    closeDialogOnConfirm: typeof props.closeDialogOnConfirm == "undefined" ? true : props.closeDialogOnConfirm,
    closeDialogOnClickAway: typeof props.closeDialogOnClickAway == "undefined" ? true : props.closeDialogOnClickAway,
    setSettings,
  };
};

type DialogContainerProps = {
  config: UseDialogConfig;
};

export const DialogContainer = ({ config }: DialogContainerProps) => {
  const {
    isOpen,
    isLoading,
    title,
    content,
    onOpen,
    onConfirm,
    onClose,
    confirmBtnContent,
    closeDialogOnClickAway,
    closeDialogOnConfirm,
    showCancelBtn = true,
    cancelBtnContent,
    cancelBtnProps,
    showConfirmBtn = true,
    confirmBtnProps,
    setSettings,
  } = config;

  // default dialogProps values
  const dialogProps: typeof config.dialogProps = {
    ...config.dialogProps,
    TransitionComponent: config.dialogProps?.TransitionComponent || DefaultTransition,
  };

  useEffect(() => {
    if (isOpen) onOpenEvent();
  }, [isOpen]);

  const onOpenEvent = async () => {
    if (!onOpen) return;
    await onOpen();
  };

  const onConfirmEvent = async () => {
    if (onConfirm) {
      setSettings({ isLoading: true });
      await onConfirm();
      setSettings({ isLoading: false });
    }

    if (closeDialogOnConfirm) setSettings({ isOpen: false });
  };

  const onCloseEvent = async () => {
    // prevent close if loading
    if (isLoading) return;

    if (onClose) {
      setSettings({ isLoading: true });
      await onClose();
      setSettings({ isLoading: false });
    }

    setSettings({ isOpen: false });
  };

  return (
    <Dialog {...dialogProps} open={isOpen} onClose={() => closeDialogOnClickAway && onCloseEvent()} sx={{ ...dialogProps?.sx, zIndex: 1401 }}>
      {title && (
        <>
          <DialogTitle>{title}</DialogTitle>
          <Divider />
        </>
      )}

      {content && (
        <>
          <DialogContent sx={{ wordBreak: "break-word" }}>{content}</DialogContent>
          <Divider />
        </>
      )}

      {/* DialogActions */}
      {showConfirmBtn != true && showCancelBtn != true ? null : (
        <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Cancel BTN */}
          {showCancelBtn == true && (
            <LoadingButton {...cancelBtnProps} onClick={onCloseEvent} loading={isLoading}>
              {cancelBtnContent || "Close"}
            </LoadingButton>
          )}

          {/* Confirm BTN */}
          {showConfirmBtn == true && (
            <LoadingButton {...confirmBtnProps} loading={isLoading} onClick={onConfirmEvent}>
              {confirmBtnContent || "OK"}
            </LoadingButton>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

const DefaultTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown, string>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});
