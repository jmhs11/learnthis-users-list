import { useState } from 'react';
import { USER_ROLES } from '../../constants/userRoles';
import { createUser } from '../../lib/api/usersApi';
import { useCreateForm } from '../../lib/hooks/UseCreateForm';
import Button from '../buttons/Button';
import InputCheckbox from '../forms/InputCheckbox';
import InputText from '../forms/InputText';
import InputTextAsync from '../forms/InputTextAsync';
import Select from '../forms/Select';
import style from './UserCreateForm.module.css';

const UserCreateForm = ({ onSuccess }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { username, name, setName, setUsername, isFormInvalid } =
		useCreateForm();

	return (
		<form
			onSubmit={ev =>
				handleSubmit(ev, name, username, setIsSubmitting, onSuccess)
			}
		>
			<div className={style.row}>
				<InputText
					className={style.input}
					label='Nombre'
					placeholder='John Doe'
					error={name.error}
					value={name.value}
					onChange={ev => setName(ev.target.value)}
				/>
				<InputTextAsync
					className={style.input}
					label='Username'
					placeholder='John Doe'
					error={username.error}
					loading={username.loading}
					success={username.value && !username.error && !username.loading}
					value={username.value}
					onChange={ev => setUsername(ev.target.value)}
				/>
			</div>
			<div className={style.row}>
				<Select name='role'>
					<option value={USER_ROLES.TEACHER}>Profesor</option>
					<option value={USER_ROLES.STUDENT}>Alumno</option>
					<option value={USER_ROLES.OTHER}>Otro</option>
				</Select>
				<div className={style.active}>
					<InputCheckbox name='active' />
					<span>¿Activo?</span>
				</div>
				<Button type='submit' disabled={isFormInvalid || isSubmitting}>
					{isSubmitting ? 'Cargando...' : 'Crear usuario'}
				</Button>
			</div>
		</form>
	);
};

const handleSubmit = async (ev, name, username, setIsSubmitting, onSuccess) => {
	ev.preventDefault();

	setIsSubmitting(true);

	const user = {
		id: crypto.randomUUID(),
		username: username.value,
		name: name.value,
		role: ev.target.role.value,
		active: ev.target.active.checked
	};

	const success = await createUser(user);

	if (success) {
		onSuccess();
	} else {
		setIsSubmitting(false);
	}
};

export default UserCreateForm;
