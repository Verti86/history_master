-- Administrator (user_metadata.role = 'admin') może usuwać dowolne wiadomości z czatu.
-- Rola admina ustawiana w Supabase: Authentication → Users → wybierz użytkownika → User Metadata → {"role": "admin"}

CREATE POLICY "admin_delete_chat_messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
