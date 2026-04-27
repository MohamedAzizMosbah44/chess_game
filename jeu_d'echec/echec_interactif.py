import tkinter as tk
from tkinter import messagebox, simpledialog

class Piece:
    def __init__(self, couleur):
        self.couleur = couleur
        self.a_bouge = False
        self.en_passant = False

    def mouvements_valides(self, x, y, plateau):
        pass

    def __str__(self):
        return self.symbole

class Pion(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 1
        self.symbole = "♙" if couleur == "blanc" else "♟"
        self.en_passant = False

    def mouvements_valides(self, x, y, plateau):
        direction = 1 if self.couleur == "noir" else -1
        mouvements = []

        # Mouvement normal
        if 0 <= x + direction < 8 and (x + direction, y) not in plateau:
            mouvements.append((x + direction, y))
            # Double mouvement depuis la position initiale
            if ((self.couleur == "noir" and x == 1) or (self.couleur == "blanc" and x == 6)) and (x + 2 * direction, y) not in plateau:
                mouvements.append((x + 2 * direction, y))

        # Capture en diagonale
        for dy in [-1, 1]:
            if 0 <= x + direction < 8 and 0 <= y + dy < 8:
                if (x + direction, y + dy) in plateau:
                    if plateau[(x + direction, y + dy)].couleur != self.couleur:
                        mouvements.append((x + direction, y + dy))
                elif (x, y + dy) in plateau and isinstance(plateau[(x, y + dy)], Pion) and plateau[(x, y + dy)].en_passant:
                    mouvements.append((x + direction, y + dy))

        return mouvements

class Tour(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 5
        self.symbole = "♖" if couleur == "blanc" else "♜"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        for dx, dy in directions:
            for i in range(1, 8):
                nx, ny = x + i * dx, y + i * dy
                if 0 <= nx < 8 and 0 <= ny < 8:
                    if (nx, ny) not in plateau:
                        mouvements.append((nx, ny))
                    else:
                        if plateau[(nx, ny)].couleur != self.couleur:
                            mouvements.append((nx, ny))
                        break
                else:
                    break

        return mouvements

class Cavalier(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 3
        self.symbole = "♘" if couleur == "blanc" else "♞"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        deplacements = [(2, 1), (1, 2), (-1, 2), (-2, 1), (-2, -1), (-1, -2), (1, -2), (2, -1)]

        for dx, dy in deplacements:
            nx, ny = x + dx, y + dy
            if 0 <= nx < 8 and 0 <= ny < 8 and ((nx, ny) not in plateau or plateau[(nx, ny)].couleur != self.couleur):
                mouvements.append((nx, ny))

        return mouvements

class Fou(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 3
        self.symbole = "♗" if couleur == "blanc" else "♝"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        directions = [(1, 1), (1, -1), (-1, 1), (-1, -1)]

        for dx, dy in directions:
            for i in range(1, 8):
                nx, ny = x + i * dx, y + i * dy
                if 0 <= nx < 8 and 0 <= ny < 8:
                    if (nx, ny) not in plateau:
                        mouvements.append((nx, ny))
                    else:
                        if plateau[(nx, ny)].couleur != self.couleur:
                            mouvements.append((nx, ny))
                        break
                else:
                    break

        return mouvements

class Dame(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 9
        self.symbole = "♕" if couleur == "blanc" else "♛"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]

        for dx, dy in directions:
            for i in range(1, 8):
                nx, ny = x + i * dx, y + i * dy
                if 0 <= nx < 8 and 0 <= ny < 8:
                    if (nx, ny) not in plateau:
                        mouvements.append((nx, ny))
                    else:
                        if plateau[(nx, ny)].couleur != self.couleur:
                            mouvements.append((nx, ny))
                        break
                else:
                    break

        return mouvements

class Roi(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = float('inf')
        self.symbole = "♔" if couleur == "blanc" else "♚"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]

        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < 8 and 0 <= ny < 8 and ((nx, ny) not in plateau or plateau[(nx, ny)].couleur != self.couleur):
                mouvements.append((nx, ny))

        return mouvements

class MouvementsSpeciaux:
    def __init__(self, jeu):
        self.jeu = jeu

    def verifier_roque_possible(self, couleur, type_roque):
        roi_pos = (7, 4) if couleur == "blanc" else (0, 4)
        roi = self.plateau.get(roi_pos)
    
        if roi is None or roi.a_bouge:
            return False
    
        if type_roque == "petit":
            tour_pos = (7, 7) if couleur == "blanc" else (0, 7)
            tour = self.plateau.get(tour_pos)
            if tour is None or tour.a_bouge:
                return False
            # Vérifiez s'il y a des pièces entre le roi et la tour
            if any(self.plateau.get((roi_pos[0], col)) for col in range(5, 7)):
                return False
        elif type_roque == "grand":
            tour_pos = (7, 0) if couleur == "blanc" else (0, 0)
            tour = self.plateau.get(tour_pos)
            if tour is None or tour.a_bouge:
                return False
            # Vérifiez s'il y a des pièces entre le roi et la tour
            if any(self.plateau.get((roi_pos[0], col)) for col in range(1, 4)):
                return False
        else:
            return False
    
        adversaire = "noir" if couleur == "blanc" else "blanc"
        # Vérifiez si le roi est en échec ou passera par une case en échec
        if type_roque == "petit":
            cases_a_verifier = [(roi_pos[0], 4), (roi_pos[0], 5), (roi_pos[0], 6)]
        else:
            cases_a_verifier = [(roi_pos[0], 4), (roi_pos[0], 3), (roi_pos[0], 2)]
    
        for case in cases_a_verifier:
            if self.est_case_menacee(case, adversaire):
                return False
    
        return True

    def est_case_menacee(self, position, couleur_adverse):
        x, y = position
        for pos, piece in self.jeu.plateau.items():
            if piece.couleur == couleur_adverse:
                if position in piece.mouvements_valides(pos[0], pos[1], self.jeu.plateau):
                    return True
        return False

    def verifier_promotion_possible(self, arrivee):
        if isinstance(self.jeu.plateau.get(arrivee), Pion):
            if (self.jeu.joueur_actuel == "blanc" and arrivee[0] == 0) or (self.jeu.joueur_actuel == "noir" and arrivee[0] == 7):
                return True
        return False

    def effectuer_roque(self, couleur, type_roque):
        if couleur == "blanc":
            if type_roque == "petit":
                self.plateau[(7, 6)] = self.plateau.pop((7, 4))  # Déplace le roi
                self.plateau[(7, 5)] = self.plateau.pop((7, 7))  # Déplace la tour
            else:
                self.plateau[(7, 2)] = self.plateau.pop((7, 4))  # Déplace le roi
                self.plateau[(7, 3)] = self.plateau.pop((7, 0))  # Déplace la tour
        else:
            if type_roque == "petit":
                self.plateau[(0, 6)] = self.plateau.pop((0, 4))  # Déplace le roi
                self.plateau[(0, 5)] = self.plateau.pop((0, 7))  # Déplace la tour
            else:
                self.plateau[(0, 2)] = self.plateau.pop((0, 4))  # Déplace le roi
                self.plateau[(0, 3)] = self.plateau.pop((0, 0))  # Déplace la tour

    def effectuer_promotion(self, arrivee, choix):
        couleur = self.jeu.joueur_actuel
        if choix == "dame":
            self.jeu.plateau[arrivee] = Dame(couleur)
        elif choix == "tour":
            self.jeu.plateau[arrivee] = Tour(couleur)
        elif choix == "fou":
            self.jeu.plateau[arrivee] = Fou(couleur)
        elif choix == "cavalier":
            self.jeu.plateau[arrivee] = Cavalier(couleur)

class AIEngine:
    PIECE_VALUES = {
        'pion': 100,
        'tour': 500,
        'cavalier': 320,
        'fou': 330,
        'dame': 900,
        'roi': 20000
    }

    @staticmethod
    
    def minimax(jeu, profondeur, maximizing_player, alpha=float('-inf'), beta=float('inf')):
        if profondeur == 0 or jeu.est_echec_et_mat("blanc") or jeu.est_echec_et_mat("noir"):
            return AIEngine.evaluer_position(jeu), None
        
        best_move = None
        
        if maximizing_player:
            max_eval = float('-inf')
            # Create a list of pieces to iterate over
            pieces = list(jeu.plateau.items())
            for depart, piece in pieces:
                if piece.couleur == "noir":
                    for arrivee in piece.mouvements_valides(depart[0], depart[1], jeu.plateau):
                        plateau_original = jeu.plateau.copy()
                        jeu.plateau[arrivee] = jeu.plateau.pop(depart)
        
                        eval_score, _ = AIEngine.minimax(jeu, profondeur - 1, False, alpha, beta)
                        jeu.plateau = plateau_original
        
                        if eval_score > max_eval:
                            max_eval = eval_score
                            best_move = (depart, arrivee)
        
                        alpha = max(alpha, eval_score)
                        if beta <= alpha:
                            break
            return max_eval, best_move
        else:
            min_eval = float('inf')
            # Create a list of pieces to iterate over
            pieces = list(jeu.plateau.items())
            for depart, piece in pieces:
                if piece.couleur == "blanc":
                    for arrivee in piece.mouvements_valides(depart[0], depart[1], jeu.plateau):
                        plateau_original = jeu.plateau.copy()
                        jeu.plateau[arrivee] = jeu.plateau.pop(depart)
        
                        eval_score, _ = AIEngine.minimax(jeu, profondeur - 1, True, alpha, beta)
                        jeu.plateau = plateau_original
        
                        if eval_score < min_eval:
                            min_eval = eval_score
                            best_move = (depart, arrivee)
        
                        beta = min(beta, eval_score)
                        if beta <= alpha:
                            break
            return min_eval, best_move


    @staticmethod
    def evaluer_position(jeu):
        score = 0
        for pos, piece in jeu.plateau.items():
            piece_value = AIEngine.get_piece_value(piece)
            if piece.couleur == "noir":
                score += piece_value
            else:
                score -= piece_value
        return score

    @staticmethod
    def get_piece_value(piece):
        if isinstance(piece, Pion):
            return AIEngine.PIECE_VALUES['pion']
        elif isinstance(piece, Tour):
            return AIEngine.PIECE_VALUES['tour']
        elif isinstance(piece, Cavalier):
            return AIEngine.PIECE_VALUES['cavalier']
        elif isinstance(piece, Fou):
            return AIEngine.PIECE_VALUES['fou']
        elif isinstance(piece, Dame):
            return AIEngine.PIECE_VALUES['dame']
        elif isinstance(piece, Roi):
            return AIEngine.PIECE_VALUES['roi']
        return 0

class JeuEchecs:
    def __init__(self, mode="pvp", difficulte="moyen"):
        self.plateau = self.initialiser_plateau()
        self.joueur_actuel = "blanc"
        self.mouvements_speciaux = MouvementsSpeciaux(self)
        self.historique = []
        self.last_move = None
        self.mode = mode
        self.difficulte = difficulte

    def initialiser_plateau(self):
        plateau = {}
        for i in range(8):
            plateau[(1, i)] = Pion("noir")
            plateau[(6, i)] = Pion("blanc")

        plateau[(0, 0)], plateau[(0, 7)] = Tour("noir"), Tour("noir")
        plateau[(0, 1)], plateau[(0, 6)] = Cavalier("noir"), Cavalier("noir")
        plateau[(0, 2)], plateau[(0, 5)] = Fou("noir"), Fou("noir")
        plateau[(0, 3)], plateau[(0, 4)] = Dame("noir"), Roi("noir")

        plateau[(7, 0)], plateau[(7, 7)] = Tour("blanc"), Tour("blanc")
        plateau[(7, 1)], plateau[(7, 6)] = Cavalier("blanc"), Cavalier("blanc")
        plateau[(7, 2)], plateau[(7, 5)] = Fou("blanc"), Fou("blanc")
        plateau[(7, 3)], plateau[(7, 4)] = Dame("blanc"), Roi("blanc")

        return plateau

    def est_match_nul(self):
        return False

    def est_en_echec(self, couleur):
        roi_position = None
        for position, piece in self.plateau.items():
            if isinstance(piece, Roi) and piece.couleur == couleur:
                roi_position = position
                break

        if not roi_position:
            return False

        for position, piece in self.plateau.items():
            if piece.couleur != couleur:
                if roi_position in piece.mouvements_valides(position[0], position[1], self.plateau):
                    return True

        return False

    def est_echec_et_mat(self, couleur):
        if not self.est_en_echec(couleur):
            return False

        for depart, piece in self.plateau.items():
            if piece.couleur == couleur:
                for arrivee in piece.mouvements_valides(*depart, self.plateau):
                    plateau_simule = self.simuler_mouvement(depart, arrivee)
                    if not self.est_en_echec_simule(couleur, plateau_simule):
                        return False

        return True

    def simuler_mouvement(self, depart, arrivee):
        plateau_simule = self.plateau.copy()
        piece = plateau_simule.pop(depart)
        plateau_simule[arrivee] = piece
        return plateau_simule

    def est_en_echec_simule(self, couleur, plateau_simule):
        roi_position = None
        for position, piece in plateau_simule.items():
            if isinstance(piece, Roi) and piece.couleur == couleur:
                roi_position = position
                break

        if not roi_position:
            return False

        for position, piece in plateau_simule.items():
            if piece.couleur != couleur:
                if roi_position in piece.mouvements_valides(position[0], position[1], plateau_simule):
                    return True

        return False

    def deplacer_piece(self, depart, arrivee):
        if depart not in self.plateau:
            return False

        piece = self.plateau[depart]
        if piece.couleur != self.joueur_actuel:
            return False

        mouvements_valides = piece.mouvements_valides(*depart, self.plateau)
        if arrivee not in mouvements_valides:
            return False

        for pos, p in self.plateau.items():
            if isinstance(p, Pion) and p.couleur == self.joueur_actuel:
                p.en_passant = False

        if isinstance(piece, Pion) and arrivee not in self.plateau and depart[1] != arrivee[1]:
            captured_pawn_pos = (depart[0], arrivee[1])
            if captured_pawn_pos in self.plateau:
                del self.plateau[captured_pawn_pos]

        if isinstance(piece, Pion) and abs(arrivee[0] - depart[0]) == 2:
            piece.en_passant = True

        plateau_simule = self.simuler_mouvement(depart, arrivee)
        if self.est_en_echec_simule(self.joueur_actuel, plateau_simule):
            return False

        # Vérifiez si le mouvement est un roque
        if isinstance(piece, Roi) and abs(arrivee[1] - depart[1]) == 2:
            type_roque = "petit" if arrivee[1] > depart[1] else "grand"
            if self.verifier_roque_possible(self.joueur_actuel, type_roque):
                self.effectuer_roque(self.joueur_actuel, type_roque)
                self.historique.append((depart, arrivee))
                self.last_move = (depart, arrivee)
                self.changer_joueur()
                return True


        self.plateau[arrivee] = self.plateau.pop(depart)
        piece.a_bouge = True

        if isinstance(piece, Pion) and (arrivee[0] == 0 or arrivee[0] == 7):
            choix = simpledialog.askstring("Promotion", "Choisissez une pièce (dame, tour, fou, cavalier):")
            if choix in ["dame", "tour", "fou", "cavalier"]:
                self.mouvements_speciaux.effectuer_promotion(arrivee, choix)

        self.historique.append((depart, arrivee))
        self.last_move = (depart, arrivee)

        return True

    def changer_joueur(self):
        self.joueur_actuel = "noir" if self.joueur_actuel == "blanc" else "blanc"

    def get_ai_move(self):
        if self.mode != "ai" or self.joueur_actuel != "noir":
            return None

        depth_map = {
            "facile": 1,
            "moyen": 2,
            "difficile": 3,
            "extreme": 4
        }

        depth = depth_map.get(self.difficulte, 2)
        _, best_move = AIEngine.minimax(self, depth, True)
        return best_move

class JeuEchecsGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Jeu d'Échecs - Chess Master")
        self.root.geometry("600x700")
        self.root.configure(bg='#f0f0f0')

        self.mode_frame = tk.Frame(root, bg='#f0f0f0')
        self.mode_frame.pack(pady=20)

        tk.Label(self.mode_frame, text="Chess Master", font=("Arial", 24, "bold"), bg='#f0f0f0').pack(pady=10)
        tk.Label(self.mode_frame, text="Choisissez le mode de jeu", font=("Arial", 12), bg='#f0f0f0').pack(pady=5)

        tk.Button(self.mode_frame, text="Joueur contre Joueur",
                  command=lambda: self.start_game("pvp"),
                  font=("Arial", 12), width=20, bg='#4CAF50', fg='white').pack(pady=5)

        tk.Button(self.mode_frame, text="Joueur contre IA",
                  command=self.show_difficulty_selection,
                  font=("Arial", 12), width=20, bg='#2196F3', fg='white').pack(pady=5)

        self.difficulty_frame = tk.Frame(root, bg='#f0f0f0')

        tk.Label(self.difficulty_frame, text="Sélectionnez la difficulté", font=("Arial", 14), bg='#f0f0f0').pack(pady=10)

        difficulties = [("Facile", "facile"), ("Moyen", "moyen"), ("Difficile", "difficile"), ("Extrême", "extreme")]
        for text, value in difficulties:
            tk.Button(self.difficulty_frame, text=text,
                      command=lambda v=value: self.start_game("ai", v),
                      font=("Arial", 10), width=15).pack(pady=2)

        tk.Button(self.difficulty_frame, text="Retour", command=self.show_mode_selection,
                  font=("Arial", 10), width=15).pack(pady=10)

        self.jeu = None
        self.canvas = None
        self.selected_square = None
        self.game_frame = None

    def show_mode_selection(self):
        self.difficulty_frame.pack_forget()
        if self.game_frame:
            self.game_frame.pack_forget()
        self.mode_frame.pack(pady=20)

    def show_difficulty_selection(self):
        self.mode_frame.pack_forget()
        self.difficulty_frame.pack(pady=20)

    def start_game(self, mode, difficulty="moyen"):
        self.mode_frame.pack_forget()
        self.difficulty_frame.pack_forget()

        self.jeu = JeuEchecs(mode, difficulty)
        self.setup_game_ui()
        self.draw_board()

    def setup_game_ui(self):
        self.game_frame = tk.Frame(self.root, bg='#f0f0f0')
        self.game_frame.pack(fill=tk.BOTH, expand=True)

        info_frame = tk.Frame(self.game_frame, bg='#f0f0f0')
        info_frame.pack(pady=10)

        self.status_label = tk.Label(info_frame, text="Tour des blancs",
                                     font=("Arial", 14, "bold"), bg='#f0f0f0')
        self.status_label.pack()

        tk.Button(info_frame, text="Nouveau Jeu", command=self.show_mode_selection,
                  font=("Arial", 10), bg='#FF9800', fg='white').pack(pady=5)

        self.canvas = tk.Canvas(self.game_frame, width=480, height=480, bg='white', highlightthickness=0)
        self.canvas.pack(pady=10)
        self.canvas.bind("<Button-1>", self.on_canvas_click)
        
    def draw_board(self):
        if not self.canvas:
            return

        self.canvas.delete("all")
        square_size = 60

        for row in range(8):
            for col in range(8):
                x1, y1 = col * square_size, row * square_size
                x2, y2 = x1 + square_size, y1 + square_size

                color = "#F0D9B5" if (row + col) % 2 == 0 else "#B58863"

                if self.selected_square == (row, col):
                    color = "#FFFF00"

                if self.jeu.last_move:
                    if (row, col) in self.jeu.last_move:
                        color = "#FFE135"

                self.canvas.create_rectangle(x1, y1, x2, y2, fill=color, outline="black")

                if col == 0:
                    self.canvas.create_text(x1 + 5, y1 + 10, text=str(8-row), font=("Arial", 8))
                if row == 7:
                    self.canvas.create_text(x2 - 10, y2 - 5, text=chr(97+col), font=("Arial", 8))

                if (row, col) in self.jeu.plateau:
                    piece = self.jeu.plateau[(row, col)]
                    self.canvas.create_text(x1 + square_size//2, y1 + square_size//2,
                                            text=piece.symbole, font=("Arial", 36))

        if self.selected_square:
            piece = self.jeu.plateau[self.selected_square]
            for move in piece.mouvements_valides(*self.selected_square, self.jeu.plateau):
                x1, y1 = move[1] * square_size, move[0] * square_size
                x2, y2 = x1 + square_size, y1 + square_size
                self.canvas.create_rectangle(x1, y1, x2, y2, fill="#0000FF", stipple="gray50", outline="")

        if self.jeu.est_echec_et_mat(self.jeu.joueur_actuel):
            winner = "noirs" if self.jeu.joueur_actuel == "blanc" else "blancs"
            self.status_label.config(text=f"Échec et mat! Les {winner} gagnent!")
        elif self.jeu.est_en_echec(self.jeu.joueur_actuel):
            self.status_label.config(text=f"Échec! Tour des {self.jeu.joueur_actuel}s")
        elif self.jeu.est_match_nul():
            self.status_label.config(text="Match nul!")
        else:
            self.status_label.config(text=f"Tour des {self.jeu.joueur_actuel}s")

    def on_canvas_click(self, event):
        if self.jeu.est_echec_et_mat(self.jeu.joueur_actuel):
            return

        col = event.x // 60
        row = event.y // 60

        if not (0 <= row < 8 and 0 <= col < 8):
            return

        clicked_square = (row, col)

        if self.selected_square is None:
            if clicked_square in self.jeu.plateau and self.jeu.plateau[clicked_square].couleur == self.jeu.joueur_actuel:
                self.selected_square = clicked_square
        else:
            if self.jeu.deplacer_piece(self.selected_square, clicked_square):
                self.jeu.changer_joueur()

                if self.jeu.mode == "ai" and self.jeu.joueur_actuel == "noir":
                    self.root.after(500, self.make_ai_move)

            self.selected_square = None

        self.draw_board()
        

    def get_mouvements_legaux(self):
        mouvements_legaux = []
        for depart, piece in self.plateau.items():
            if piece.couleur == self.joueur_actuel:
                for arrivee in piece.mouvements_valides(*depart, self.plateau):
                    plateau_simule = self.simuler_mouvement(depart, arrivee)
                    if not self.est_en_echec_simule(self.joueur_actuel, plateau_simule):
                        mouvements_legaux.append((depart, arrivee))
        return mouvements_legaux
    
    def est_materiel_insuffisant(self):
        pieces = list(self.plateau.values())
        if len(pieces) == 2:  # Seulement les deux rois restent
            return True
    
        if len(pieces) == 3:  # Un roi et un cavalier ou un fou contre un roi
            if any(isinstance(piece, Cavalier) or isinstance(piece, Fou) for piece in pieces):
                return True
    
        return False


    def make_ai_move(self):
        if self.jeu.mode == "ai" and self.jeu.joueur_actuel == "noir":
            ai_move = self.jeu.get_ai_move()
            if ai_move:
                depart, arrivee = ai_move
                if self.jeu.deplacer_piece(depart, arrivee):
                    self.jeu.changer_joueur()
                    self.draw_board()

if __name__ == "__main__":
    root = tk.Tk()
    jeu_gui = JeuEchecsGUI(root)
    root.mainloop()

