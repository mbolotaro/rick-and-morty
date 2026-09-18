import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/core/ui/app_background.dart';
import 'package:pickle_verso/core/ui/app_button.dart';
import 'package:pickle_verso/features/auth/presentation/auth_controller.dart';
import 'package:pickle_verso/features/auth/presentation/auth_panel.dart';
import 'package:pickle_verso/features/auth/presentation/auth_validators.dart';

class SignUpScreen extends ConsumerStatefulWidget {
  const SignUpScreen({super.key});

  @override
  ConsumerState<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends ConsumerState<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstName = TextEditingController();
  final _lastName = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirmation = TextEditingController();
  var _obscurePassword = true;

  @override
  void dispose() {
    _firstName.dispose();
    _lastName.dispose();
    _email.dispose();
    _password.dispose();
    _confirmation.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;
    await ref
        .read(authControllerProvider.notifier)
        .signUp(
          firstName: _firstName.text,
          lastName: _lastName.text,
          email: _email.text,
          password: _password.text,
        );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authControllerProvider);
    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppPrimitives.space5),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 440),
                child: AuthPanel(
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          children: [
                            IconButton(
                              tooltip: 'Voltar',
                              onPressed: context.pop,
                              icon: const Icon(Icons.arrow_back_rounded),
                            ),
                            Expanded(
                              child: Text(
                                'Criar conta',
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineSmall,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          'Abra seu próprio portal para o PickleVerso.',
                          style: TextStyle(
                            color: context.colors.contentSecondary,
                          ),
                        ),
                        const SizedBox(height: AppPrimitives.space4),
                        TextFormField(
                          controller: _firstName,
                          textCapitalization: TextCapitalization.words,
                          decoration: const InputDecoration(labelText: 'Nome'),
                          validator: AuthValidators.name,
                        ),
                        const SizedBox(height: AppPrimitives.space3),
                        TextFormField(
                          controller: _lastName,
                          textCapitalization: TextCapitalization.words,
                          decoration: const InputDecoration(
                            labelText: 'Sobrenome',
                          ),
                          validator: AuthValidators.name,
                        ),
                        const SizedBox(height: AppPrimitives.space3),
                        TextFormField(
                          controller: _email,
                          keyboardType: TextInputType.emailAddress,
                          autofillHints: const [AutofillHints.email],
                          decoration: const InputDecoration(
                            labelText: 'E-mail',
                          ),
                          validator: AuthValidators.email,
                        ),
                        const SizedBox(height: AppPrimitives.space3),
                        TextFormField(
                          controller: _password,
                          obscureText: _obscurePassword,
                          autofillHints: const [AutofillHints.newPassword],
                          decoration: InputDecoration(
                            labelText: 'Senha',
                            suffixIcon: IconButton(
                              onPressed: () => setState(
                                () => _obscurePassword = !_obscurePassword,
                              ),
                              icon: Icon(
                                _obscurePassword
                                    ? Icons.visibility_rounded
                                    : Icons.visibility_off_rounded,
                              ),
                            ),
                          ),
                          validator: AuthValidators.strongPassword,
                        ),
                        const SizedBox(height: AppPrimitives.space3),
                        TextFormField(
                          controller: _confirmation,
                          obscureText: _obscurePassword,
                          onFieldSubmitted: (_) => _submit(),
                          decoration: const InputDecoration(
                            labelText: 'Confirmar senha',
                          ),
                          validator: (value) => value == _password.text
                              ? null
                              : 'As senhas não coincidem.',
                        ),
                        if (state.errorMessage != null) ...[
                          const SizedBox(height: AppPrimitives.space3),
                          Text(
                            state.errorMessage!,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: context.colors.danger,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                        const SizedBox(height: AppPrimitives.space5),
                        AppButton(
                          label: 'Criar conta',
                          onPressed: _submit,
                          isLoading: state.isSubmitting,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
