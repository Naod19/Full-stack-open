const LoginForm = ({
	onSubmit,
	usernameValue,
	onUsernameChange,
	passwordValue,
	onPasswordChange,
}) => {
	return (
		<div>
			<h3>Login into the application</h3>
			<form onSubmit={onSubmit}>
				<div>
					<label>
						username
						<input
							type="text"
							value={usernameValue}
							onChange={({ target }) =>
								onUsernameChange(target.value)
							}
						/>
					</label>
				</div>
				<div>
					<label>
						password
						<input
							type="password"
							value={passwordValue}
							onChange={({ target }) =>
								onPasswordChange(target.value)
							}
						/>
					</label>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

export default LoginForm;
