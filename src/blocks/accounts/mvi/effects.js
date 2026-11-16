/**
 * Efectos declarativos del bloque de cuentas.
 *
 * La sesion la administra Firebase Authentication, por lo que ya no existe un
 * efecto `OpenSession`: el cierre de sesion se declara como `CloseSession`.
 */

import { createEffect } from "../../../mvi/core.js";

export const VerifyCredentials = ({ username, password, remember = false } = {}) =>
  createEffect("VerifyCredentials", { username, password, remember });

export const CreateAccount = ({
  username,
  password,
  display_name = "",
  role = "operator",
} = {}) => createEffect("CreateAccount", { username, password, display_name, role });

/** Actualiza la marca `last_login` del perfil. */
export const RecordLogin = () => createEffect("RecordLogin", {});

/** Cierra la sesion de Firebase Authentication. */
export const CloseSession = () => createEffect("CloseSession", {});
